export const CANDIDATES = [
  { id: "Candidate-1", name: "Candidate 1", initials: "C1", tone: "bg-sky-100 text-sky-800" },
  { id: "Candidate-2", name: "Candidate 2", initials: "C2", tone: "bg-violet-100 text-violet-800" },
  { id: "Candidate-3", name: "Candidate 3", initials: "C3", tone: "bg-emerald-100 text-emerald-800" },
  { id: "Candidate-4", name: "Candidate 4", initials: "C4", tone: "bg-amber-100 text-amber-800" },
];

export const candidateName = (id) =>
  id
    ? id
        .split(" and ")
        .map((part) => CANDIDATES.find((candidate) => candidate.id === part)?.name || part)
        .join(" and ")
    : "";
