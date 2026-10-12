import { cx } from "../../lib/cx.js";
import { forwardRef, useId, useState } from "react";


export function Spinner({ className = "" }) {
  return (
    <span
      className={cx("inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent", className)}
      aria-hidden="true"
    />
  );
}

const VARIANTS = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "bg-surface text-ink border border-line hover:bg-canvas",
  ghost: "text-ink-soft hover:bg-brand-50 hover:text-ink",
  danger: "bg-danger-600 text-white hover:bg-danger-600/90",
};

export const Button = forwardRef(function Button(
  { variant = "primary", loading = false, disabled = false, block = false, className = "", children, ...props },
  ref
) {
  const inactive = disabled || loading;
  return (
    <button
      ref={ref}
      disabled={inactive}
      aria-busy={loading || undefined}
      className={cx(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition active:scale-[0.98]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        VARIANTS[variant],
        block && "w-full",
        className
      )}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
});

export function Input({ label, error, hint, type = "text", className = "", ...props }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink-soft">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && visible ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${id}-note` : undefined}
          className={cx(
            "h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-ink placeholder:text-ink-muted/70",
            "autofill:bg-surface autofill:[-webkit-text-fill-color:theme(colors.ink.DEFAULT)] autofill:[transition:background-color_600000s_0s,color_600000s_0s]",
            "outline-none focus:outline-none disabled:cursor-not-allowed",
            isPassword && "pr-12"
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            className="absolute inset-y-0 right-0 flex items-center px-3.5 text-ink-muted transition-colors hover:text-ink"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
          >
            <svg viewBox="0 0 24 24" className="size-[1.125rem]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {visible ? (
                <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.8 9.8 0 0112 5c5 0 9 4.5 10 7a12.6 12.6 0 01-3 4.2M6.2 6.2A12.8 12.8 0 002 12c1 2.5 5 7 10 7a9.7 9.7 0 004.2-.9" />
              ) : (
                <>
                  <path d="M2 12c1-2.5 5-7 10-7s9 4.5 10 7c-1 2.5-5 7-10 7S3 14.5 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        )}
      </div>
      {(error || hint) && (
        <p id={`${id}-note`} className={cx("text-xs", error ? "text-danger-600" : "text-ink-muted")}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

export function Card({ interactive = false, className = "", children, ...props }) {
  return (
    <div
      className={cx(
        "rounded-3xl border border-line bg-surface",
        interactive && "transition duration-300 hover:-translate-y-1 hover:border-brand-400/60 hover:bg-brand-50/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Skeleton({ className = "" }) {
  return (
    <span
      className={cx(
        "relative block overflow-hidden rounded-md bg-line/70",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent",
        className
      )}
      aria-hidden="true"
    />
  );
}

const TONES = {
  neutral: "bg-canvas text-ink-soft border-line",
  success: "bg-success-50 text-success-600 border-success-600/20",
  warn: "bg-warn-50 text-warn-600 border-warn-600/20",
  danger: "bg-danger-50 text-danger-600 border-danger-600/20",
  brand: "bg-brand-50 text-brand-700 border-brand-500/20",
};

export function Badge({ tone = "neutral", dot = false, children }) {
  return (
    <span className={cx("inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold", TONES[tone])}>
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function Alert({ tone = "danger", children }) {
  return (
    <div role="alert" className={cx("rounded-xl border px-4 py-3 text-sm", TONES[tone])}>
      {children}
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-ink-muted sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-3">{actions}</div>}
    </div>
  );
}

