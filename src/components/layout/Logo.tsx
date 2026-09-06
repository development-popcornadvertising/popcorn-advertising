import Image from "next/image";
import Link from "next/link";

import logoReverse from "@/assets/brand/logo-reverse.png";
import logo from "@/assets/brand/logo.png";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/siteConfig";

interface LogoProps {
  /** "dark" for the ink/grape backgrounds, "light" for cream. */
  tone?: "light" | "dark";
  size?: "sm" | "md";
  /** Set on the header instance, which is always above the fold. */
  isEager?: boolean;
  className?: string;
}

/** Rendered widths, measured off the comp's header and footer lockups. */
const sizes = { sm: 140, md: 168 } as const;

/**
 * The brand lockup, as a link home.
 *
 * Extracted because the header, footer and holding page all need it.
 * The wordmark is part of the artwork, so the image is decorative
 * (`alt=""`) and the accessible name comes from the link's aria-label —
 * otherwise a screen reader announces the brand twice.
 *
 * The two files are separate artwork rather than one recoloured asset:
 * the reverse lockup maps pink to butter on the wordmark but to white on
 * the box, so it cannot be derived with a filter.
 */
export function Logo({ tone = "light", size = "md", isEager = false, className }: LogoProps) {
  const source = tone === "dark" ? logoReverse : logo;
  const width = sizes[size];

  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={cn("inline-flex shrink-0 items-center", className)}
    >
      <Image
        src={source}
        alt=""
        width={width}
        height={Math.round((width / source.width) * source.height)}
        // Next 16 deprecated `priority`; the docs point at loading/fetchPriority.
        loading={isEager ? "eager" : "lazy"}
        fetchPriority={isEager ? "high" : "auto"}
        className="h-auto max-w-full transition-transform duration-300 ease-soft motion-safe:hover:scale-[1.03]"
      />
    </Link>
  );
}
