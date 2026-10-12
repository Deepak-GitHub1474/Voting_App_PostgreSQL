import { useEffect, useRef } from "react";

import { cx } from "../../lib/cx.js";

export default function Sheet({ open, onClose, label = "Menu", className = "", children }) {
  const panel = useRef(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement;
    const root = document.documentElement;
    root.classList.add("overflow-hidden");
    panel.current?.focus({ preventScroll: true });
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      root.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", onKey);
      opener?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  return (
    <div
      className={cx("fixed inset-0 z-50 overflow-hidden transition-[visibility] duration-300", open ? "visible" : "invisible pointer-events-none", className)}
      inert={open ? undefined : ""}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className={cx(
          "absolute inset-0 size-full cursor-default bg-ink/25 transition-opacity duration-300 ease-out motion-reduce:transition-none",
          open ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={cx(
          "absolute inset-y-0 right-0 flex w-[min(18rem,80%)] flex-col overflow-y-auto border-l border-line bg-surface outline-none",
          "transform-gpu transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-transform motion-reduce:transition-none",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {children}
      </div>
    </div>
  );
}
