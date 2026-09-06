"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  /** Lets the mobile panel close itself when a link is followed. */
  onNavigate?: () => void;
  className?: string;
}

/**
 * A header link that knows whether it is the current page.
 *
 * The only reason any part of the header is a Client Component: it needs
 * `usePathname`. Header itself stays a Server Component.
 *
 * Hash links are never marked active. On a one-page site every nav item
 * bar "Home" is an in-page anchor, and marking them all current would make
 * `aria-current` meaningless. Tracking the scrolled-to section instead
 * would need an observer, which is not worth the JavaScript here.
 */
export function NavLink({ href, children, onNavigate, className }: NavLinkProps) {
  const pathname = usePathname();

  const isHashLink = href.includes("#");
  const isActive = !isHashLink && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative inline-block py-1 transition-colors duration-200",
        // The underline grows from the left on hover and stays put when the
        // link is the current page.
        "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left",
        "after:rounded-pill after:bg-pop after:transition-transform after:duration-300 after:ease-soft",
        "after:scale-x-0 hover:text-pop hover:after:scale-x-100",
        // The current page keeps its underline and its pop colour. This was
        // hover-only while the site was one page, where the only thing ever
        // marked current was "Home" and a permanent underline under it sat
        // on screen the entire time. Now that /about is a real route the
        // indicator earns its place, and it is what makes `aria-current`
        // visible to people who are not using a screen reader.
        isActive ? "text-pop after:scale-x-100" : "text-ink",
        className,
      )}
    >
      {children}
    </Link>
  );
}
