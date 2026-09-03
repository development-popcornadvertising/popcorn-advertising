import type { ComponentPropsWithoutRef, ReactNode } from "react";

import Link from "next/link";

import { cn } from "@/lib/cn";

type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonSize = "md" | "lg";

interface BaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

type ButtonProps = BaseProps &
  (
    | ({ href: string } & Omit<
        ComponentPropsWithoutRef<typeof Link>,
        "href" | "className" | "children"
      >)
    | ({ href?: never } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">)
  );

const base =
  "rounded-pill inline-flex items-center justify-center gap-2 font-medium " +
  // A press that moves is the cheapest way for a control to feel physical.
  // active: sits after hover: so the press wins while the pointer is down.
  "transition-[colors,transform,box-shadow] duration-200 " +
  "motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0 " +
  "disabled:cursor-not-allowed disabled:opacity-60 " +
  "disabled:hover:translate-y-0 disabled:hover:shadow-none";

const variants: Record<ButtonVariant, string> = {
  solid:
    "bg-pop hover:bg-pop-deep text-white shadow-sm shadow-pop/25 hover:shadow-md hover:shadow-pop/30",
  outline: "border-grape text-grape hover:bg-grape hover:text-cream border",
  ghost: "text-grape hover:text-pop",
};

const sizes: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

/**
 * Renders an anchor when `href` is given and a button otherwise.
 *
 * This distinction matters: navigation must be an <a> so it supports
 * middle-click, right-click and copy-link. Only real in-page actions
 * (submitting, toggling) are <button>.
 */
export function Button({
  children,
  variant = "solid",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (props.href !== undefined) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...rest } = props;
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
