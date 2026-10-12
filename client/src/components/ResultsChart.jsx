import { useEffect, useState } from "react";

import { CANDIDATES } from "../lib/candidates.js";
import { Skeleton } from "./ui/index.jsx";
import { cx } from "../lib/cx.js";

export function ResultsSkeleton() {
  return (
    <ul className="flex flex-col gap-5" aria-busy="true" aria-label="Loading results">
      {CANDIDATES.map((candidate) => (
        <li key={candidate.id} className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-2.5 w-full rounded-full" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function ResultsChart({ results }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  const top = Math.max(0, ...results.candidates.map((candidate) => candidate.votes));
  return (
    <ul className="flex flex-col gap-5">
      {CANDIDATES.map((candidate) => {
        const votes = results.candidates.find((row) => row.name === candidate.id)?.votes || 0;
        const share = results.total ? Math.round((votes / results.total) * 100) : 0;
        const leading = top > 0 && votes === top;
        return (
          <li key={candidate.id} className="-mx-2 flex items-center gap-4 rounded-2xl px-2 py-1.5 transition-colors hover:bg-brand-50/60">
            <span className={cx("grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold", candidate.tone)}>
              {candidate.initials}
            </span>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-medium text-ink">
                  {candidate.name}
                  {leading && <span className="rounded-full bg-success-50 px-2 py-0.5 text-[0.6875rem] font-semibold text-success-600">Leading</span>}
                </span>
                <span className="tabular-nums text-ink-muted">
                  <span className="font-semibold text-ink">{votes}</span> · {share}%
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-brand-50">
                <div
                  className={cx("h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none", shown ? `w-pct-${share}` : "w-pct-0", leading ? "bg-gradient-to-r from-brand-500 to-brand-700" : "bg-brand-200")}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
