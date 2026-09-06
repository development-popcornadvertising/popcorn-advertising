import Image, { type StaticImageData } from "next/image";

import { cn } from "@/lib/cn";

interface MediaFrameProps {
  /** Poster or still. */
  image?: StaticImageData;
  /** Muted looping clip. Takes precedence over `image`, which becomes its poster. */
  video?: string;
  /** Describes the media. Required whenever `image` is given. */
  alt?: string;
  /** Hints the browser how much width the frame occupies, for srcset. */
  sizes?: string;
  className?: string;
}

/**
 * The dark media panel, used by the hero and the why-us card.
 *
 * The comp leaves both of these as flat rectangles: slots waiting for a
 * showreel that does not exist yet, and that is exactly what this renders.
 *
 * SEVERAL PLACEHOLDER TREATMENTS WERE TRIED HERE AND ALL REMOVED, so nobody
 * rebuilds one: scattered blurred kernels (warm butter at low opacity over
 * near-black goes brown, and small blurred shapes read as smudges on the
 * lens), a cropped watermark (clean but inert), a scrolling credit roll of
 * the twelve disciplines (it duplicated the ticker directly below the hero),
 * a poster-scale popcorn burst (large soft lobes stop reading as popcorn and
 * start reading as clouds), and a film-frame plate with viewfinder brackets
 * and a play mark (legible, but it is chrome the comp does not have).
 *
 * The empty state is deliberately empty. Shape, size and colour all come
 * from the caller, so the panel matches the comp exactly and there is
 * nothing to unpick when footage lands.
 *
 * When it does land it is a prop, not a rewrite: pass `image`, or `video`
 * with `image` as its poster.
 */
export function MediaFrame({ image, video, alt = "", sizes, className }: MediaFrameProps) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-ink", className)}>
      {video ? (
        <video
          className="absolute inset-0 size-full object-cover"
          poster={image?.src}
          autoPlay
          muted
          loop
          playsInline
          aria-label={alt || undefined}
        >
          <source src={video} />
        </video>
      ) : null}

      {!video && image ? (
        <Image src={image} alt={alt} fill sizes={sizes} className="object-cover" />
      ) : null}
    </div>
  );
}
