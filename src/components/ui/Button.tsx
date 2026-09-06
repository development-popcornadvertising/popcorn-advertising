import type { ComponentPropsWithoutRef, ReactNode } from "react";

import Link from "next/link";

import { MoveRight } from "lucide-react";

import { cn } from "@/lib/cn";

type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonSize = "md" | "lg";

interface BaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * Appends the long-tailed arrow from the design. Opt-in, because the
   * comp only draws it on the four page-level calls to action and not on
   * the header's "Contact Us".
   */
  hasArrow?: boolean;
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
  "group/btn inline-flex shrink-0 items-center justify-center gap-2.5 rounded-pill font-medium " +
  "transition-[transform,box-shadow,background-color,color,border-color] duration-150 ease-soft " +
  "disabled:cursor-not-allowed disabled:opacity-60";

/**
 * The solid variant is the signature control: a pill sitting on a 6px
 * hard-offset slab of pop-deep, so it reads as a physical key.
 *
 * The slab is a `box-shadow` rather than a pseudo-element or a nested
 * span. It follows the pill radius for free, it renders identically on
 * the anchor and button branches below, it survives a label that wraps,
 * and it leaves `outline` untouched so the site-wide :focus-visible ring
 * still lands correctly.
 *
 * Pressing is motion-safe only: hover sinks 2px and the slab shortens to
 * 4px, active sinks the full 6px and the slab disappears, so the control
 * visibly bottoms out.
 *
 * THE FACE COLOUR DOES NOT CHANGE ON HOVER, and that is deliberate. It used
 * to darken to `pop-deep` — the same colour as the slab underneath — so
 * hovering collapsed the key into one flat maroon lozenge and threw away the
 * whole 3D read. Going lighter is not available either: white on `pop` is
 * 4.55:1, barely over the 4.5 floor for a 15px label, and any lift breaks it.
 *
 * So hover is carried by depth instead of hue: the key sinks, the slab
 * shortens, and a soft coloured glow blooms underneath it. That reads as the
 * button coming toward the pointer rather than as a colour swap, and it
 * leaves the contrast ratio untouched.
 */
const variants: Record<ButtonVariant, string> = {
  solid:
    "bg-pop text-white shadow-[0_6px_0_var(--color-pop-deep)] " +
    "hover:shadow-[0_6px_0_var(--color-pop-deep),0_14px_28px_-10px_rgb(229_17_108_/_0.55)] " +
    "motion-safe:hover:translate-y-0.5 " +
    "motion-safe:hover:shadow-[0_4px_0_var(--color-pop-deep),0_14px_28px_-10px_rgb(229_17_108_/_0.55)] " +
    "motion-safe:active:translate-y-1.5 motion-safe:active:shadow-[0_0_0_var(--color-pop-deep)] " +
    "motion-safe:disabled:translate-y-0 motion-safe:disabled:shadow-[0_6px_0_var(--color-pop-deep)]",
  outline:
    "border-2 border-grape text-grape " +
    "hover:bg-grape hover:text-cream hover:shadow-[0_10px_24px_-10px_rgb(88_85_165_/_0.55)] " +
    "motion-safe:hover:-translate-y-0.5",
  ghost: "text-grape hover:text-pop",
};

const sizes: Record<ButtonSize, string> = {
  // 44px tall with a 15px label, both measured off the comp. 15px has no
  // equivalent on the type scale and every button in the design uses it.
  md: "h-11 px-7 text-[0.9375rem]",
  lg: "h-13 px-8 text-base",
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
  hasArrow = false,
  className,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  const content = (
    <>
      {children}
      {hasArrow ? (
        <MoveRight
          aria-hidden="true"
          className="size-5 transition-transform duration-200 ease-soft motion-safe:group-hover/btn:translate-x-1"
        />
      ) : null}
    </>
  );

  if (props.href !== undefined) {
    const { href, ...rest } = props;

    // next/link drives the router, which is meaningless for a mail, tel or
    // off-site target. Render those as a plain anchor instead.
    if (/^(mailto:|tel:|https?:)/.test(href)) {
      return (
        <a href={href} className={classes} {...rest}>
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...rest } = props;
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}
