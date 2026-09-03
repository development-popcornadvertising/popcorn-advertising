/**
 * Geometry for the popcorn mark.
 *
 * Data, not JSX, so it can be shared by the SVG component, the intro
 * animation and the generated icon routes without any of them importing a
 * component from another. One shape, one definition.
 *
 * TODO [BLOCKED on brand assets]: retire this once the designer supplies
 * public/logo.svg.
 */

export interface Puff {
  cx: number;
  cy: number;
  r: number;
}

/** Coordinate space all puff sets below are expressed in. */
export const POPCORN_VIEWBOX = 40;

/** The full mark. Seven puffs, for display at 24px and up. */
export const POPCORN_PUFFS = [
  { cx: 20, cy: 21, r: 8 },
  { cx: 13, cy: 13, r: 7.5 },
  { cx: 26, cy: 11, r: 6.5 },
  { cx: 31, cy: 22, r: 6.5 },
  { cx: 8, cy: 24, r: 6 },
  { cx: 15, cy: 32, r: 5.5 },
  { cx: 27, cy: 32, r: 5 },
] as const satisfies readonly Puff[];

/**
 * Three-lobe variant for icons.
 *
 * A favicon is rasterised to 16px, where each puff of the full mark lands
 * on roughly three pixels and the cluster collapses into an indistinct
 * blob. Three large overlapping circles keep a readable silhouette at that
 * size while still reading as the same shape at 64px and up.
 *
 * Verified by rendering the icon route at 32px rather than by assuming.
 */
export const POPCORN_PUFFS_COMPACT = [
  { cx: 14, cy: 16.5, r: 10 },
  { cx: 26, cy: 16.5, r: 10 },
  { cx: 20, cy: 26, r: 10.5 },
] as const satisfies readonly Puff[];
