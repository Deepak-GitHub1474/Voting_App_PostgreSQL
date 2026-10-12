import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useFetcher, useLocation } from "react-router-dom";

import { cx } from "../../lib/cx.js";
import { homeFor, ROUTES } from "../../lib/routes.js";
import { useRoot } from "../../lib/use-root.js";
import { Button } from "../ui/index.jsx";
import Sheet from "../ui/Sheet.jsx";
import ProfileMenu from "./ProfileMenu.jsx";

export function Logo() {
  return (
    <Link to="/" className="text-xl font-bold tracking-tight text-ink" aria-label="Ballot home">
      Ballot<span className="text-brand-500">.</span>
    </Link>
  );
}

const linkClass = ({ isActive }) =>
  cx(
    "relative inline-flex h-16 items-center text-sm font-medium transition-colors",
    "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:rounded-full after:bg-brand-600 after:transition-transform after:duration-300",
    isActive ? "text-ink after:scale-x-100" : "text-ink-muted after:scale-x-0 hover:text-brand-700"
  );

export default function Header() {
  const { user } = useRoot();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const { pathname } = useLocation();
  const logout = useFetcher();
  const leaving = logout.state !== "idle";

  useEffect(() => close(), [pathname, close]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => logout.submit(null, { method: "post", action: "/logout" });

  const links = [{ ...ROUTES.overview, end: true }];
  if (user) links.push(homeFor(user));

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
    <header className={cx("sticky top-0 z-30 border-b backdrop-blur-md transition-colors duration-300", scrolled ? "border-line bg-surface/90" : "border-line/60 bg-surface/70")}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-10 md:gap-16">
          <Logo />
          <nav className="hidden items-center gap-7 sm:flex" aria-label="Main">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          {user ? (
            <ProfileMenu user={user} initials={initials} leaving={leaving} onLogout={handleLogout} />
          ) : (
            <>
              <Link to="/login" className="inline-flex h-9 items-center rounded-full px-3 text-sm font-semibold text-ink-soft hover:bg-brand-50 hover:text-ink">
                Login
              </Link>
              <Link to="/register" className="inline-flex h-9 items-center rounded-full bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-full text-ink-soft hover:bg-brand-50 sm:hidden"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-label="Open menu"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

    </header>

      <Sheet open={open} onClose={close} className="sm:hidden">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
          <span className="text-sm font-semibold text-ink-muted">Menu</span>
          <button type="button" onClick={close} className="-mr-2 grid size-10 place-items-center rounded-full text-ink-soft hover:bg-brand-50" aria-label="Close menu">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {user && (
          <div className="flex items-center gap-3 border-b border-line px-5 py-4">
            <span className="grid size-10 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">{initials}</span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium text-ink">{user.name}</p>
              <p className="text-xs text-ink-muted">{user.isAdmin ? "Administrator" : "Voter"}</p>
            </div>
          </div>
        )}
        <nav className="flex flex-col gap-1 p-3" aria-label="Mobile">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} onClick={close} className={({ isActive }) => cx("border-l-2 px-3 py-3 text-base font-medium transition-colors", isActive ? "border-brand-600 text-ink" : "border-transparent text-ink-muted hover:text-ink")}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-line p-5">
          {user ? (
            <Button variant="secondary" block loading={leaving} onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/register" onClick={close} className="inline-flex h-11 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700">
                Register
              </Link>
              <Link to="/login" onClick={close} className="inline-flex h-11 items-center justify-center rounded-full border border-line text-sm font-semibold text-ink hover:bg-canvas">
                Login
              </Link>
            </div>
          )}
        </div>
      </Sheet>
    </>
  );
}
