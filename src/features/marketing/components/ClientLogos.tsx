import Image from "next/image";

import { MarqueeTrack } from "@/components/ui/MarqueeTrack";
import { cn } from "@/lib/cn";

import { clients } from "../data/clients";

interface ClientLogosProps {
  /** Runs the strip right-to-left instead, for the second pass. */
  isReversed?: boolean;
  /**
   * Hides the whole strip from assistive tech. The page shows this wall
   * twice for visual rhythm, so exactly one instance should be announced
   * and the other marked decorative.
   */
  isDecorative?: boolean;
  className?: string;
}

/**
 * The client logo wall.
 *
 * ACCESSIBILITY NOTE, and it differs from `Marquee` on purpose. That
 * component hides its whole strip from assistive tech because the service
 * names it scrolls also appear as real content elsewhere on the page. These
 * brand names appear nowhere else, so hiding every strip would delete
 * information rather than de-duplicate it.
 *
 * So each strip hides its own duplicated second copy, and the page marks one
 * of its two strips `isDecorative` — otherwise a screen reader would read the
 * same eight brands out twice.
 *
 * The logos keep their own relative widths rather than a shared height.
 * They are not optically normalised in the comp, and forcing a common height
 * would blow Starbucks' wordmark up next to Ford's oval.
 *
 * SCALE is applied here rather than baked into the data, so `clients.ts`
 * stays a record of each file's native size. It buys two things at once: at
 * the comp's 1:1 sizes the wall marched across the page and swamped the
 * section, and every supplied file is a 1x raster, so drawing them at full
 * size left them soft on any 2x display. The comp draws them at native
 * size, so SCALE is 1; drop it to ~0.7 if crispness on 2x matters more
 * than matching the comp.
 */
const SCALE = 0.85;
export function ClientLogos({
  isReversed = false,
  isDecorative = false,
  className,
}: ClientLogosProps) {
  return (
    <div
      aria-hidden={isDecorative ? "true" : undefined}
      className={cn("overflow-hidden edge-fade py-5", className)}
    >
      <MarqueeTrack
        className={cn(
          "flex w-max motion-safe-only items-center",
          isReversed ? "animate-logo-wall-reverse" : "animate-logo-wall",
        )}
      >
        {/* Six copies, not two. The track translates by half its width, so
            two copies make the step exactly one list — and this list is only
            ~1280px, narrower than the viewport, which left a 446px blank
            strip at the loop point on a 1728px screen. Three lists per step
            clears any realistic width. Keep the count even. */}
        {[0, 1, 2, 3, 4, 5].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 0 && !isDecorative ? undefined : "true"}
            className="flex shrink-0 items-center gap-14 pr-14"
          >
            {clients.map((client) => (
              <li key={client.name} className="flex shrink-0 items-center">
                <Image
                  src={client.logo}
                  alt={copy === 0 && !isDecorative ? client.name : ""}
                  width={Math.round(client.width * SCALE)}
                  height={Math.round(
                    ((client.width * SCALE) / client.logo.width) * client.logo.height,
                  )}
                  className="h-auto w-auto opacity-90 transition-opacity duration-300 hover:opacity-100"
                  style={{ width: Math.round(client.width * SCALE) }}
                />
              </li>
            ))}
          </ul>
        ))}
      </MarqueeTrack>
    </div>
  );
}
