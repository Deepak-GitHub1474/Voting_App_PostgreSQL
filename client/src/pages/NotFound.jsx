import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <p className="text-sm font-semibold text-brand-600">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-sm text-ink-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link to="/" className="mt-8 inline-flex h-11 items-center rounded-full bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700">
        Back to Overview
      </Link>
    </div>
  );
}
