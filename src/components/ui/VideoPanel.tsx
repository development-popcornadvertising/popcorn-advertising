"use client";

import { useRef, useState } from "react";

import Image, { type StaticImageData } from "next/image";

import { Pause, Play } from "lucide-react";

import { cn } from "@/lib/cn";

interface VideoPanelProps {
  /** Path under public/. Must be URL-safe: no spaces. */
  src: string;
  /** Shown until the visitor presses play. Also the video's own poster. */
  poster: StaticImageData;
  /** Describes the footage, for the button and the video's accessible name. */
  label: string;
  /** Hints the browser how much width the panel occupies, for the poster srcset. */
  sizes?: string;
  className?: string;
}

/**
 * The showreel, behind a play button.
 *
 * IT DOES NOT AUTOPLAY, AND THAT IS THE POINT. The reel is 3840x2160 and
 * 7.6MB; the poster beside it is 18KB. Autoplaying would make every visitor,
 * on every device, pay 7.6MB for decoration before they have asked for it,
 * and the file is on the home hero where that cost lands first. The video
 * element is not even mounted until the button is pressed, so until then the
 * panel costs one optimised image.
 *
 * Three more things fall out of that choice for free:
 *
 * - The footage has no audio track, so a play button cannot mean "unmute".
 *   Deferring the load is the only reading of a play button that does real
 *   work here.
 * - WCAG 2.2.2 requires a pause mechanism for any motion that runs over five
 *   seconds. A loop that only ever starts on a click, and carries a pause
 *   control once it does, satisfies that without a special case.
 * - `prefers-reduced-motion` needs no handling either. Nothing moves until
 *   the visitor asks it to, which is what the preference is asking for.
 *
 * `muted` stays on despite the silent track: without it a programmatic
 * play() can be refused by the browser's autoplay policy even directly
 * inside a click handler.
 */
export function VideoPanel({ src, poster, label, sizes, className }: VideoPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  function start() {
    setHasStarted(true);
    setIsPlaying(true);
    // The element mounts in the same commit, so the ref is only populated on
    // the next frame. play() is fired from the click either way, which is
    // what keeps the browser's autoplay policy satisfied.
    requestAnimationFrame(() => void videoRef.current?.play());
  }

  function toggle() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  return (
    <div className={cn("group/reel relative isolate overflow-hidden bg-ink", className)}>
      {hasStarted ? (
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          poster={poster.src}
          aria-label={label}
          muted
          loop
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={poster}
          alt=""
          fill
          sizes={sizes}
          className="object-cover"
          // The hero panel is above the fold, so its poster is what the
          // largest-contentful-paint measurement actually lands on.
          priority
        />
      )}

      {/* Before the first play the whole panel is the control: a big target
          that needs no aiming. Afterwards it shrinks into the corner so it
          stops covering the footage it is controlling. */}
      {!hasStarted ? (
        <button
          type="button"
          onClick={start}
          aria-label={`Play ${label}`}
          className="absolute inset-0 grid place-items-center focus-visible:outline-offset-[-4px]"
        >
          <span
            className={cn(
              "grid size-18 place-items-center rounded-pill bg-pop text-white",
              "shadow-[0_6px_0_var(--color-pop-deep)]",
              "transition-[transform,box-shadow] duration-150 ease-soft",
              "motion-safe:group-hover/reel:translate-y-0.5",
              "group-hover/reel:shadow-[0_4px_0_var(--color-pop-deep)]",
            )}
          >
            {/* Nudged right: a triangle centred on its bounding box reads as
                sitting left of centre. */}
            <Play className="ml-1 size-7 fill-current" aria-hidden="true" />
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={toggle}
          aria-label={`${isPlaying ? "Pause" : "Play"} ${label}`}
          className={cn(
            "absolute right-4 bottom-4 grid size-11 place-items-center rounded-pill",
            "bg-ink/55 text-white backdrop-blur-sm",
            "transition-[background-color,opacity] duration-200 ease-soft hover:bg-ink/80",
            // Out of the way while playing, back on hover or keyboard focus.
            // Never hidden outright: a control you cannot find is not a control.
            "opacity-0 group-hover/reel:opacity-100 focus-visible:opacity-100",
            !isPlaying && "opacity-100",
          )}
        >
          {isPlaying ? (
            <Pause className="size-5 fill-current" aria-hidden="true" />
          ) : (
            <Play className="ml-0.5 size-5 fill-current" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}
