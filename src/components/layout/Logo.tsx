import Link from "next/link";

import { PopcornMark } from "@/components/ui/PopcornMark";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/siteConfig";

interface LogoProps {
  /** "dark" for the ink/grape backgrounds, "light" for cream. */
  tone?: "light" | "dark";
  size?: "sm" | "md";
  className?: string;
}

/**
 * The brand lockup, as a link home.
 *
 * Extracted because the header, footer and holding page all need it. The
 * accessible name comes from the aria-label rather than the visible text,
 * so a screen reader announces the destination once instead of reading the
 * wordmark twice.
 */
export function Logo({ tone = "light", size = "md", className }: LogoProps) {
  const isDark = tone === "dark";

  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <PopcornMark
        className={cn(
          "transition-transform duration-300 motion-safe:group-hover:scale-110",
          size === "md" ? "size-10" : "size-8",
          isDark ? "text-butter" : "text-pop",
        )}
      />

      <span
        className={cn(
          "font-display leading-[1.1] tracking-tight",
          size === "md" ? "text-lg" : "text-base",
          isDark ? "text-cream" : "text-ink",
        )}
      >
        Popcorn
        <span className={cn("block text-sm", isDark ? "text-butter/85" : "text-grape")}>
          Advertising
        </span>
      </span>
    </Link>
  );
}
