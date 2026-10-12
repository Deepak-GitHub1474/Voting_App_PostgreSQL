import { BASE_URL } from "../config/config.js";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, { method = "GET", body, signal } = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      signal,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) {
    throw new ApiError(payload?.message || "Something went wrong. Please try again.", response.status);
  }
  return payload.data;
}
