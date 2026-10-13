import { Link, useLoaderData } from "react-router-dom";

import ResultsChart, { ResultsSkeleton } from "../components/ResultsChart.jsx";
import { Badge, Card, Skeleton } from "../components/ui/index.jsx";
import { candidateName } from "../lib/candidates.js";
import { cx } from "../lib/cx.js";
import { homeFor, ROUTES } from "../lib/routes.js";
import { useRoot } from "../lib/use-root.js";

const ICONS = {
  user: "M16 19v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1M10 10a3 3 0 100-6 3 3 0 000 6zM19 8v6M22 11h-6",
  check: "M9 12l2 2 4-4M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
};

const STEPS = [
  { icon: "user", title: "Register", body: "Sign up with your email. Each email can hold exactly one ballot." },
  { icon: "check", title: "Cast your vote", body: "Pick one of the four candidates while the poll is open. Votes are final." },
  { icon: "chart", title: "See the result", body: "When the admin closes the poll, the winner and full tally go live here." },
];

const STATS = [
  { value: "1", label: "vote each" },
  { value: "0", label: "early peeks" },
  { value: "100%", label: "server tally" },
];

function Icon({ d, className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function primaryAction(user) {
  return user ? homeFor(user) : ROUTES.register;
}

function StatusCard({ election, results }) {
  const live = Boolean(election?.isVotingResultLive);

  if (!election) {
    return (
      <div className="flex flex-col gap-5" aria-busy="true">
        <Skeleton className="h-7 w-36 rounded-full" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-56" />
        <div className="mt-4">
          <ResultsSkeleton />
        </div>
      </div>
    );
  }

  const tie = election.winnerCandidate?.includes(" and ");
  const status = election.isVotingOn ? "Poll open" : live ? "Results published" : "Poll closed";

  return (
    <div className="lg:pl-6">
      <div className="flex items-center gap-3">
        <Badge tone={election.isVotingOn ? "success" : live ? "brand" : "warn"} dot>
          {status}
        </Badge>
      </div>

      {live ? (
        <>
          <p className="mt-7 text-sm font-medium text-ink-muted">{tie ? "Result · tie between" : "Winner"}</p>
          <p className="mt-1 bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-4xl font-semibold tracking-tight text-transparent">
            {candidateName(election.winnerCandidate) || "No votes were cast"}
          </p>
          <div className="mt-8">{results ? <ResultsChart results={results} /> : <ResultsSkeleton />}</div>
          {results && <p className="mt-6 text-xs text-ink-muted">{results.total} total votes counted</p>}
        </>
      ) : (
        <>
          <p className="mt-7 text-3xl font-semibold tracking-tight text-ink">{election.isVotingOn ? "Voting is in progress" : "Results are being prepared"}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
            {election.isVotingOn
              ? "Totals stay hidden until the poll closes, so early numbers can't sway anyone."
              : "The admin will publish the winner and the full tally shortly."}
          </p>
          <div className="mt-8 flex -space-x-2" aria-hidden="true">
            {["C1", "C2", "C3", "C4"].map((label) => (
              <span key={label} className="grid size-11 place-items-center rounded-full border-2 border-canvas bg-brand-50 text-xs font-bold text-brand-700">
                {label}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Landing() {
  const { user, election } = useRoot();
  const { results } = useLoaderData();
  const action = primaryAction(user);

  return (
    <div className="relative flex flex-col gap-20">
      <div className="pointer-events-none absolute bg-[radial-gradient(40rem_22rem_at_12%_0%,rgb(47_154_107/0.14),transparent_70%),radial-gradient(34rem_20rem_at_92%_18%,rgb(79_180_135/0.12),transparent_70%)] inset-x-[-50vw] -top-24 -z-10 h-[34rem]" aria-hidden="true" />

      <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Badge tone="brand" dot>
            Secure online elections
          </Badge>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]">
            Every voice counted,{" "}
            <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">exactly once.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
            Ballot runs a simple, transparent election: verified accounts, one vote each, and results published the
            moment the poll closes.
          </p>
          <div className="mt-9 grid max-w-sm grid-cols-2 gap-3 sm:flex sm:max-w-none">
            <>
                <Link
                  to={action.to}
                  className={cx(
                    "group inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-full bg-brand-600 px-3 text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-[0.98] sm:w-44 sm:px-5",
                    user && "col-span-2 sm:w-auto"
                  )}
                >
                  {action.label}
                  <svg viewBox="0 0 24 24" className="size-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                {!user && (
                  <Link to="/login" className="inline-flex h-11 min-w-0 items-center justify-center rounded-full border border-line bg-surface px-3 text-sm font-semibold text-ink transition hover:border-brand-400 hover:text-brand-700 active:scale-[0.98] sm:w-44 sm:px-5">
                    Login
                  </Link>
                )}
            </>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-2xl font-semibold tracking-tight text-ink">{stat.value}</dd>
                <dd className="mt-0.5 whitespace-nowrap text-xs text-ink-muted">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <StatusCard election={election} results={results} />
      </section>

      {!user && election?.isVotingOn && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">How it works</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Three steps, start to result</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <Card interactive className="group h-full p-4">
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-2xl bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                      <Icon d={ICONS[step.icon]} />
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-ink-muted/60">0{index + 1}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.body}</p>
                </Card>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
