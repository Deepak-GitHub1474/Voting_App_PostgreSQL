import { useState } from "react";
import { Link, useFetcher, useLoaderData } from "react-router-dom";

import { Alert, Badge, Button, PageHeader } from "../components/ui/index.jsx";
import { CANDIDATES, candidateName } from "../lib/candidates.js";
import { cx } from "../lib/cx.js";
import { useRoot } from "../lib/use-root.js";

const STATUS = {
  open: { label: "Poll open", tone: "success" },
  published: { label: "Results published", tone: "brand" },
  closed: { label: "Poll closed", tone: "warn" },
};

const formatTime = (value) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

function Receipt({ candidate, votedAt, election, name }) {
  const meta = CANDIDATES.find((item) => item.id === candidate);
  const status = election?.isVotingResultLive ? STATUS.published : election?.isVotingOn ? STATUS.open : STATUS.closed;

  return (
    <section className="mx-auto w-full max-w-md rounded-3xl border border-line bg-surface p-4">
      <div className="flex items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-success-50 text-success-600">
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">Vote recorded</h1>
          <p className="text-sm text-ink-muted">Thanks for taking part{name ? `, ${name}` : ""}.</p>
        </div>
      </div>

      <dl className="mt-6 divide-y divide-line border-y border-dashed border-line text-sm">
        <div className="flex items-center justify-between gap-4 py-4">
          <dt className="text-ink-muted">Candidate</dt>
          <dd className="flex items-center gap-2 font-semibold text-ink">
            {meta && <span className={cx("grid size-7 place-items-center rounded-full text-[0.625rem] font-bold", meta.tone)}>{meta.initials}</span>}
            {candidateName(candidate)}
          </dd>
        </div>
        {votedAt && (
          <div className="flex items-center justify-between gap-4 py-4">
            <dt className="text-ink-muted">Cast on</dt>
            <dd className="text-right font-medium text-ink">{formatTime(votedAt)}</dd>
          </div>
        )}
        <div className="flex items-center justify-between gap-4 py-4">
          <dt className="text-ink-muted">Status</dt>
          <dd>
            <Badge tone={status.tone} dot>
              {status.label}
            </Badge>
          </dd>
        </div>
      </dl>

      {election?.isVotingResultLive ? (
        <Link to="/" className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700">
          See results
        </Link>
      ) : (
        <>
          <p className="mt-6 text-sm leading-relaxed text-ink-muted">Votes are final and counted once. Results appear on the Overview as soon as they are published.</p>
          <Link to="/" className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full border border-line text-sm font-semibold text-ink hover:bg-canvas">
            Back to Overview
          </Link>
        </>
      )}
    </section>
  );
}

export default function Ballot() {
  const { candidate: myVote, votedAt } = useLoaderData();
  const { user, election } = useRoot();
  const vote = useFetcher();
  const [choice, setChoice] = useState("");
  const [confirming, setConfirming] = useState(false);

  const submitting = vote.state !== "idle";
  const submitError = vote.state === "idle" ? vote.data?.error : undefined;

  const submit = () => vote.submit({ candidate: choice }, { method: "post" });

  if (myVote) return <Receipt candidate={myVote} votedAt={votedAt} election={election} name={user?.name.split(" ")[0]} />;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Choose your candidate"
        description="Select one candidate. You can review your choice before it's submitted, and it can't be changed afterwards."
        actions={election && (election.isVotingOn ? <Badge tone="success" dot>Poll open</Badge> : <Badge tone="warn" dot>Poll closed</Badge>)}
      />

      {!election?.isVotingOn ? (
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
                    "flex cursor-pointer items-center gap-4 rounded-3xl border bg-surface p-4 transition duration-300 hover:-translate-y-0.5",
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

          <div className="flex flex-col gap-4 rounded-3xl bg-brand-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-muted">
              {!choice
                ? "Select a candidate to continue."
                : confirming
                  ? <>Confirm your vote for <span className="font-semibold text-ink">{candidateName(choice)}</span>. This can&apos;t be undone.</>
                  : <>You selected <span className="font-semibold text-ink">{candidateName(choice)}</span>.</>}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:flex">
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
                <Button className="col-span-2" onClick={() => setConfirming(true)} disabled={!choice}>
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
