export interface ProcessStep {
  /** Stable id, also used as the React key. */
  id: string;
  title: string;
  description: string;
}

/** The four stages every brief moves through, in order. */
export const processSteps = [
  {
    id: "scope",
    title: "Listen & scope",
    description:
      "We dig into the brand, the audience and the actual problem before touching a single deck.",
  },
  {
    id: "plan",
    title: "Plan the pop",
    description:
      "Strategy and creative concepting, matched to the right mix of our twelve services.",
  },
  {
    id: "produce",
    title: "Produce",
    description: "In-house shoots, edits, design and production, with no third-party hand-offs.",
  },
  {
    id: "launch",
    title: "Launch & track",
    description: "We place the work, watch the numbers, and keep tuning while it is live.",
  },
] as const satisfies readonly ProcessStep[];
