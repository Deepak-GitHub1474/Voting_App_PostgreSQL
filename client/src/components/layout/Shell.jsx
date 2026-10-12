import { useEffect } from "react";
import { Link, Outlet, ScrollRestoration, useLocation, useRevalidator, useRouteError } from "react-router-dom";

import { useRoot } from "../../lib/use-root.js";
import { Skeleton } from "../ui/index.jsx";
import Header from "./Header.jsx";

export function Root() {
  const { offline } = useRoot();
  const revalidator = useRevalidator();

  useEffect(() => {
    if (!offline || revalidator.state !== "idle") return;
    const timer = window.setTimeout(() => revalidator.revalidate(), 3000);
    return () => window.clearTimeout(timer);
  }, [offline, revalidator]);

  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

export function Shell() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <Outlet />
      </main>
      {pathname === "/" && (
        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>Ballot · secure, one-person-one-vote elections</p>
            <p>Built by Deepak Chaudhary</p>
          </div>
        </footer>
      )}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-24 sm:px-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-9 w-72" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
      </div>
    </div>
  );
}

export function RouteError() {
  const error = useRouteError();
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-5 text-center">
      <p className="text-sm font-semibold text-brand-600">Something went wrong</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">We couldn&apos;t load this page</h1>
      <p className="mt-3 text-sm text-ink-muted">{error?.message || "Please try again in a moment."}</p>
      <Link to="/" reloadDocument className="mt-8 inline-flex h-11 items-center rounded-full bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700">
        Reload
      </Link>
    </div>
  );
}
