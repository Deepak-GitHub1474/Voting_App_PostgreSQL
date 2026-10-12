import toast from "react-hot-toast";
import { redirect } from "react-router-dom";

import { api } from "./api.js";
import { homeFor } from "./routes.js";

const firstName = (name) => name.split(" ")[0];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegistration({ name, email, password, phone }) {
  const errors = {};
  if (!name.trim()) errors.name = "Enter your full name";
  if (!EMAIL.test(email.trim())) errors.email = "Enter a valid email address";
  if (password.length < 6) errors.password = "Use at least 6 characters";
  if (!/^\+?[0-9\s-]{7,15}$/.test(phone.trim())) errors.phone = "Enter a valid phone number";
  return errors;
}

let session = Promise.resolve({ user: null, election: null, offline: true });

async function loadSession(signal) {
  try {
    const [user, election] = await Promise.all([api("/", { signal }), api("/voting/status", { signal })]);
    return { user, election, offline: false };
  } catch (error) {
    if (error.name === "AbortError") throw error;
    return { user: null, election: null, offline: true };
  }
}

export function rootLoader({ request }) {
  session = loadSession(request.signal);
  return session;
}

async function requireRole(request, role) {
  const { user } = await session;
  const { pathname } = new URL(request.url);
  if (!user) throw redirect(`/login?from=${encodeURIComponent(pathname)}`);
  if (role === "admin" && !user.isAdmin) throw redirect("/");
  if (role === "voter" && user.isAdmin) throw redirect("/admin");
}

export async function guestLoader() {
  const { user } = await session;
  if (user) throw redirect(homeFor(user).to);
  return null;
}

export async function landingLoader({ request }) {
  const { election } = await session;
  if (!election?.isVotingResultLive) return { results: null };
  try {
    const results = await api("/voting/results", { signal: request.signal });
    return { results: results.published ? results : null };
  } catch (error) {
    if (error.name === "AbortError") throw error;
    return { results: null };
  }
}

async function protectedFetch(request, role, path) {
  await requireRole(request, role);
  try {
    return await api(path, { signal: request.signal });
  } catch (error) {
    if (error.status === 401) throw redirect(`/login?from=${encodeURIComponent(new URL(request.url).pathname)}`);
    throw error;
  }
}

export const ballotLoader = ({ request }) => protectedFetch(request, "voter", "/voting/me");

export const adminLoader = ({ request }) => protectedFetch(request, "admin", "/admin/summary");

const RETURN_PATHS = { voter: ["/", "/ballot"], admin: ["/", "/admin"] };

function safeReturnPath(from, user) {
  const allowed = RETURN_PATHS[user.isAdmin ? "admin" : "voter"];
  return allowed.includes(from) ? from : homeFor(user).to;
}

export async function loginAction({ request }) {
  const form = Object.fromEntries(await request.formData());
  try {
    const user = await api("/login", { method: "POST", body: { email: form.email, password: form.password } });
    toast.success(`Welcome back, ${firstName(user.name)}`);
    return redirect(safeReturnPath(new URL(request.url).searchParams.get("from"), user));
  } catch (error) {
    return { error: error.message };
  }
}

export async function registerAction({ request }) {
  const form = Object.fromEntries(await request.formData());
  const fieldErrors = validateRegistration(form);
  if (Object.keys(fieldErrors).length) return { fieldErrors };
  try {
    const user = await api("/register", { method: "POST", body: form });
    toast.success(`Welcome, ${firstName(user.name)}`);
    return redirect(homeFor(user).to);
  } catch (error) {
    return { error: error.message };
  }
}

export async function logoutAction() {
  try {
    await api("/logout", { method: "POST", body: {} });
    toast.success("Logged out");
  } catch {
    toast.error("Could not log out, please try again");
    return null;
  }
  return redirect("/login");
}

export async function ballotAction({ request }) {
  const { candidate } = Object.fromEntries(await request.formData());
  try {
    await api("/voting", { method: "POST", body: { candidate } });
    toast.success("Vote recorded");
    return { ok: true };
  } catch (error) {
    return { error: error.message };
  }
}

const ADMIN_ACTIONS = {
  publish: { path: "/voting/result/live", done: "Results published" },
  reopen: { path: "/voting/restart", done: "Voting reopened" },
};

export async function adminAction({ request }) {
  const { intent } = Object.fromEntries(await request.formData());
  const action = ADMIN_ACTIONS[intent];
  if (!action) return { error: "Unknown action" };
  try {
    await api(action.path, { method: "PATCH" });
    toast.success(action.done);
    return { ok: true };
  } catch (error) {
    toast.error(error.message);
    return { error: error.message };
  }
}
