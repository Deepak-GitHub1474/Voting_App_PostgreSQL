import { Logo } from "./Header.jsx";

const POINTS = [
  "One account, one vote — enforced by the server",
  "Your choice stays private; only totals are published",
  "Results go live the moment the admin closes the poll",
];

export default function AuthFrame({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="pointer-events-none absolute -right-32 -top-32 size-[28rem] rounded-full bg-white/10" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 size-[26rem] rounded-full bg-white/5" aria-hidden="true" />
        <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Secure online elections</p>
        <div className="relative max-w-md">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">Every voice counted, exactly once.</h2>
          <ul className="mt-10 flex flex-col gap-4">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-white/85">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/15">
                  <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex flex-col px-5 py-8 sm:px-10">
        <Logo />
        <section className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>
          <div className="mt-9">{children}</div>
          {footer && <div className="mt-8 text-center text-sm text-ink-muted">{footer}</div>}
        </section>
      </main>
    </div>
  );
}
