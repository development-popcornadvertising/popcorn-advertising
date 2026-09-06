import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Centres content and applies the responsive gutter. Used by every section.
 *
 * The gutter sits inside `max-w-page`, which is sized to account for it —
 * see the `--container-page` comment in globals.css.
 */
export function Container({ children, className }: ContainerProps) {
  return <div className={cn("mx-auto w-full max-w-page px-6 md:px-10", className)}>{children}</div>;
}
