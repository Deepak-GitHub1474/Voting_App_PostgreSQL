import { useEffect, useState } from "react";
import { useFetcher, useLoaderData } from "react-router-dom";

import ResultsChart from "../components/ResultsChart.jsx";
import { Badge, Button, PageHeader } from "../components/ui/index.jsx";
import { candidateName } from "../lib/candidates.js";
import { useRoot } from "../lib/use-root.js";

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-2xl font-semibold tabular-nums tracking-tight text-ink sm:text-4xl">{value}</p>
      <p className="mt-1 whitespace-nowrap text-xs text-ink-muted sm:text-sm">{label}</p>
    </div>
  );
}

const ACTIONS = {
  publish: {
    title: "Publish results?",
    body: "This closes the poll and shows the winner and full tally to everyone.",
    confirm: "Close poll & publish",
    variant: "primary",
  },
  reopen: {
    title: "Reopen voting?",
    body: "Results are hidden again and the poll reopens. Existing votes are kept; people who already voted can't vote twice.",
    confirm: "Reopen voting",
    variant: "danger",
  },
};

export default function Admin() {
  const summary = useLoaderData();
  const { election } = useRoot();
  const control = useFetcher();
  const [pending, setPending] = useState(null);
  const busy = control.state !== "idle";

  useEffect(() => {
    if (control.state === "idle" && control.data?.ok) setPending(null);
  }, [control.state, control.data]);

  const run = () => control.submit({ intent: pending }, { method: "post" });

  const turnout = summary.voters ? Math.round((summary.total / summary.voters) * 100) : 0;
  const leader = summary.winner ? candidateName(summary.winner) : "—";

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Admin console"
        title="Election control"
        description="Monitor turnout, watch the tally and publish the result when the round is over."
        actions={
          election &&
          (election.isVotingOn ? <Badge tone="success" dot>Poll open</Badge> : election.isVotingResultLive ? <Badge tone="brand" dot>Results published</Badge> : <Badge tone="warn" dot>Poll closed</Badge>)
        }
      />


      <div className="grid grid-cols-3 gap-4 sm:max-w-2xl">
        <Stat label="Votes" value={summary.total} />
        <Stat label="Voters" value={summary.voters} />
        <Stat label="Turnout" value={`${turnout}%`} />
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Live tally</h2>
            <span className="text-xs text-ink-muted">Leader: {leader}</span>
          </div>
          <div className="mt-6">
            <ResultsChart results={summary} />
          </div>
        </section>

        <section className="flex flex-col self-start rounded-3xl bg-brand-50/70 p-4">
          <h2 className="text-lg font-semibold">Round controls</h2>
          <p className="mt-1.5 text-sm text-ink-muted">Voters see changes immediately.</p>

          {pending ? (
            <div className="mt-6 rounded-2xl bg-surface p-4">
              <p className="font-semibold text-ink">{ACTIONS[pending].title}</p>
              <p className="mt-1 text-sm text-ink-muted">{ACTIONS[pending].body}</p>
              <div className="mt-4 flex gap-3">
                <Button variant="secondary" onClick={() => setPending(null)} disabled={busy}>
                  Cancel
                </Button>
                <Button variant={ACTIONS[pending].variant} onClick={run} loading={busy}>
                  {ACTIONS[pending].confirm}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-3">
              <Button block onClick={() => setPending("publish")} disabled={!election || !election.isVotingOn}>
                Close poll &amp; publish results
              </Button>
              <Button block variant="secondary" onClick={() => setPending("reopen")} disabled={!election || election.isVotingOn}>
                Reopen voting
              </Button>
              {election && (
                <p className="text-xs text-ink-muted">
                  {election.isVotingOn ? "Publishing is available while the poll is open." : "Reopening starts a new round of voting."}
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
