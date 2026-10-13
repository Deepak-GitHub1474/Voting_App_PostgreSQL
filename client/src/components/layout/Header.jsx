import { useEffect, useState } from "react";
import { Link, NavLink, useFetcher } from "react-router-dom";

import { cx } from "../../lib/cx.js";
import { homeFor, ROUTES } from "../../lib/routes.js";
import { useRoot } from "../../lib/use-root.js";
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
  const logout = useFetcher();
  const leaving = logout.state !== "idle";

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

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <ProfileMenu user={user} initials={initials} links={links} leaving={leaving} onLogout={handleLogout} />
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
      </div>
    </header>
  );
}
