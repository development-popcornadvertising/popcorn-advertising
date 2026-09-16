import type { NumberedItem } from "../components/NumberedCard";

/**
 * The three things the studio holds to, in the order they happen: an idea
 * has to mean something before it can make anyone feel anything, and it has
 * to do both before placing it is worth the money.
 */
export const beliefs = [
  {
    id: "mean",
    title: "Make it mean something.",
    description: "Pretty isn't enough. Every idea needs a reason to exist.",
  },
  {
    id: "feel",
    title: "Make it feel something.",
    description: "The work should create a reaction, not just fill a feed.",
  },
  {
    id: "go",
    title: "Make it go somewhere.",
    description: "A good idea deserves the right audience, moment and medium.",
  },
] as const satisfies readonly NumberedItem[];
