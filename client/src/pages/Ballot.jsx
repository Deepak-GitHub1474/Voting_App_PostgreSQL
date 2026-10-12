import { useState } from "react";
import { Link, useFetcher, useLoaderData } from "react-router-dom";

import { Alert, Badge, Button, PageHeader } from "../components/ui/index.jsx";
import { CANDIDATES, candidateName } from "../lib/candidates.js";
import { cx } from "../lib/cx.js";
import { useRoot } from "../lib/use-root.js";

function Receipt({ candidate }) {
  const meta = CANDIDATES.find((item) => item.id === candidate);
  return (
    <div className="mx-auto max-w-lg py-6 text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-success-50 text-success-600">
        <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h2 className="mt-6 text-2xl font-semibold tracking-tight">Your vote is recorded</h2>
      <p className="mt-2 text-sm text-ink-muted">Votes are final and counted once. Thank you for taking part.</p>
      <div className="mx-auto mt-8 flex w-fit items-center gap-3 rounded-full bg-brand-50 py-2 pl-2 pr-6">
        {meta && <span className={cx("grid size-10 place-items-center rounded-full text-xs font-bold", meta.tone)}>{meta.initials}</span>}
        <div className="text-left">
          <p className="text-xs text-ink-muted">You voted for</p>
          <p className="font-semibold text-ink">{candidateName(candidate)}</p>
        </div>
      </div>
      <Link to="/" className="mt-6 inline-flex h-11 items-center rounded-full border border-line px-5 text-sm font-semibold text-ink hover:bg-canvas">
        Back to Overview
      </Link>
    </div>
  );
}

export default function Ballot() {
  const { candidate: myVote } = useLoaderData();
  const { election } = useRoot();
  const vote = useFetcher();
  const [choice, setChoice] = useState("");
  const [confirming, setConfirming] = useState(false);

  const submitting = vote.state !== "idle";
  const submitError = vote.state === "idle" ? vote.data?.error : undefined;

  const submit = () => vote.submit({ candidate: choice }, { method: "post" });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Ballot"
        title={myVote ? "Thanks for voting" : "Choose your candidate"}
        description={myVote ? undefined : "Select one candidate. You can review your choice before it's submitted, and it can't be changed afterwards."}
        actions={election && (election.isVotingOn ? <Badge tone="success" dot>Poll open</Badge> : <Badge tone="warn" dot>Poll closed</Badge>)}
      />

      {myVote ? (
        <Receipt candidate={myVote} />
      ) : !election?.isVotingOn ? (
        <div className="mx-auto max-w-lg py-6 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Voting is closed</h2>
          <p className="mt-2 text-sm text-ink-muted">This round ended before you voted. The admin can reopen voting for a new round.</p>
          <Link to="/" className="mt-6 inline-flex h-11 items-center rounded-full border border-line px-5 text-sm font-semibold hover:bg-canvas">
            Back to Overview
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {submitError && <Alert>{submitError}</Alert>}
          <fieldset className="grid gap-4 sm:grid-cols-2" disabled={submitting}>
            <legend className="sr-only">Candidates</legend>
            {CANDIDATES.map((candidate) => {
              const selected = choice === candidate.id;
              return (
                <label
                  key={candidate.id}
                  className={cx(
                    "flex cursor-pointer items-center gap-4 rounded-3xl border bg-surface p-5 transition duration-300 hover:-translate-y-0.5",
                    selected ? "border-brand-500 bg-brand-50/60 ring-4 ring-brand-500/10" : "border-line hover:border-brand-400/60",
                    submitting && "cursor-not-allowed opacity-70"
                  )}
                >
                  <input
                    type="radio"
                    name="candidate"
                    value={candidate.id}
                    checked={selected}
                    onChange={() => {
                      setChoice(candidate.id);
                      setConfirming(false);
                    }}
                    className="sr-only"
                  />
                  <span className={cx("grid size-12 shrink-0 place-items-center rounded-full text-sm font-bold", candidate.tone)}>{candidate.initials}</span>
                  <span className="flex-1">
                    <span className="block font-semibold text-ink">{candidate.name}</span>
                    <span className="block text-sm text-ink-muted">{selected ? "Selected" : "Tap to select"}</span>
                  </span>
                  <span
                    className={cx("grid size-6 place-items-center rounded-full border-2 transition-colors", selected ? "border-brand-600 bg-brand-600 text-white" : "border-line")}
                    aria-hidden="true"
                  >
                    {selected && (
                      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </label>
              );
            })}
          </fieldset>

          <div className="flex flex-col gap-4 rounded-3xl bg-brand-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-muted">
              {!choice
                ? "Select a candidate to continue."
                : confirming
                  ? <>Confirm your vote for <span className="font-semibold text-ink">{candidateName(choice)}</span>. This can&apos;t be undone.</>
                  : <>You selected <span className="font-semibold text-ink">{candidateName(choice)}</span>.</>}
            </p>
            <div className="flex gap-3">
              {confirming ? (
                <>
                  <Button variant="secondary" onClick={() => setConfirming(false)} disabled={submitting}>
                    Change
                  </Button>
                  <Button onClick={submit} loading={submitting}>
                    {submitting ? "Submitting…" : "Confirm vote"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setConfirming(true)} disabled={!choice}>
                  Review vote
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
