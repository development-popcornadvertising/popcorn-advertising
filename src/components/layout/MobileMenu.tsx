"use client";

import { useEffect, useId, useState } from "react";

import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/siteConfig";

import { NavLink } from "./NavLink";

/**
 * The small-screen navigation panel.
 *
 * Three things this gets right that a naive version does not:
 *
 * 1. The body scroll lock captures and restores the *original* overflow
 *    value rather than blindly resetting it to "", so it composes with
 *    anything else that might lock scrolling.
 * 2. Escape closes it, because a full-screen overlay with no keyboard exit
 *    is a trap.
 * 3. It closes on navigation, via `onNavigate` on each link rather than an
 *    effect watching the pathname. Every nav item is currently an in-page
 *    anchor, so the pathname never changes and such an effect would never
 *    fire; the click handler is what actually does the work, and it keeps
 *    working unchanged when About and Work become real routes.
 */
export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="grid size-11 place-items-center rounded-pill text-ink transition-colors duration-200 hover:bg-grape/10"
      >
        {isOpen ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <Menu className="size-5" aria-hidden="true" />
        )}
      </button>

      <div
        id={panelId}
        hidden={!isOpen}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 bg-cream px-6 py-10",
          "top-[var(--header-height)] overflow-y-auto",
        )}
      >
        <nav aria-label="Mobile">
          <ul className="flex flex-col gap-6 text-2xl">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} onNavigate={() => setIsOpen(false)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Button href={siteConfig.cta.href} size="lg" hasArrow className="mt-10 w-full">
          {siteConfig.cta.label}
        </Button>
      </div>
    </div>
  );
}
