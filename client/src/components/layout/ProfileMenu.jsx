import { useEffect, useRef, useState } from "react";

import { cx } from "../../lib/cx.js";
import { Spinner } from "../ui/index.jsx";

export default function ProfileMenu({ user, initials, leaving, onLogout }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);

  useEffect(() => {
    if (!open) return;
    const away = (event) => !root.current?.contains(event.target) && setOpen(false);
    const esc = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", away);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("pointerdown", away);
      window.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Account menu"
        className="grid size-10 place-items-center rounded-full border border-line bg-brand-50 text-sm font-semibold text-brand-700 transition-colors hover:border-brand-400"
      >
        {initials}
      </button>

      <div
        role="dialog"
        aria-label="Account"
        aria-hidden={!open}
        inert={open ? undefined : ""}
        className={cx(
          "absolute right-0 z-40 mt-2 w-72 origin-top-right overflow-hidden rounded-2xl border border-line bg-surface",
          "transition duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none",
          open ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-1 scale-[0.97] opacity-0"
        )}
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">{initials}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
            <p className="truncate text-xs text-ink-muted">{user.email}</p>
          </div>
        </div>
        <div className="p-2">
          <p className="px-3 pb-2 pt-1 text-xs text-ink-muted">{user.isAdmin ? "Administrator" : "Voter"}</p>
          <button
            type="button"
            onClick={onLogout}
            disabled={leaving}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-danger-600 transition-colors hover:bg-danger-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {leaving && <Spinner />}
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
