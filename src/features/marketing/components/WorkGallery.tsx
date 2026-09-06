"use client";

import { Fragment, useState, type ReactNode } from "react";

import { FilterChip } from "@/components/ui/FilterChip";

import { ALL_PROJECTS } from "../data/projects";

interface GalleryItem {
  id: string;
  /** Matched against the active chip. A plain string, never a node. */
  category: string;
  /** The card, already rendered on the server. */
  card: ReactNode;
}

interface WorkGalleryProps {
  filters: readonly string[];
  items: readonly GalleryItem[];
}

/**
 * The filter row and the grid it filters.
 *
 * WHY THIS IS A CLIENT COMPONENT, AND WHY THE CARDS ARE NOT. Filtering
 * needs state, and `searchParams` is not an option here: reading it opts
 * the route into dynamic rendering, and every route in this project has to
 * stay statically prerendered. So one `useState`.
 *
 * What that state must not drag across the boundary is the cards. Each item
 * arrives as `{ id, category, card }` where `card` is an *already rendered*
 * node and `category` is a plain string. This component filters strings and
 * renders opaque nodes, so `ProjectCard` stays a Server Component and its
 * code never ships. The same discipline `MarqueeTrack` and `NavLink`
 * document: the client leaf owns the interaction and nothing else. It also
 * means `ProjectCard` can pick up `next/image` for real project
 * photography later without pulling image code client-side.
 *
 * Keys are `item.id`, so a card that survives a filter change is moved
 * rather than remounted. That is what stops the whole grid replaying its
 * `reveal` animation every time a chip is pressed.
 */
export function WorkGallery({ filters, items }: WorkGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<string>(ALL_PROJECTS);

  const visible =
    activeFilter === ALL_PROJECTS ? items : items.filter((item) => item.category === activeFilter);

  return (
    <>
      <div role="group" aria-label="Filter work by service" className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <FilterChip
            key={filter}
            isActive={filter === activeFilter}
            onSelect={() => setActiveFilter(filter)}
          >
            {filter}
          </FilterChip>
        ))}
      </div>

      {/* Pressing a chip changes the page silently otherwise: the grid just
          becomes shorter, with nothing to announce it. */}
      <p aria-live="polite" className="sr-only">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>

      <ul className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {/* A keyed Fragment, not a wrapper element. `card` is already an
            <li>, so anything real here would nest one inside another and
            break both the markup and the grid. The Fragment renders nothing
            and still gives React the stable key. */}
        {visible.map((item) => (
          <Fragment key={item.id}>{item.card}</Fragment>
        ))}
      </ul>
    </>
  );
}
