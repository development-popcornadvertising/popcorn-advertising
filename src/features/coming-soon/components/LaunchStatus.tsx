/**
 * The "we are still building" indicator.
 *
 * Replaces a filled pill. A pill is the most template-looking component on
 * a launch page, and its dot inherited the label colour, so it rendered as
 * a dead grey speck on a pale ground. This is bare type plus a solid
 * brand-coloured dot: less furniture, more contrast.
 *
 * The dot does not animate. A pinging halo was tried and removed: on a
 * static holding page nothing is actually updating, so a pulse implies
 * activity that is not there and only draws the eye away from the headline.
 */
export function LaunchStatus({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-3 text-xs font-medium tracking-[0.2em] text-grape uppercase">
      <span className="relative flex size-2.5 shrink-0">
        <span className="absolute inset-0 rounded-full bg-pop opacity-70 motion-safe:animate-ping" />
        <span className="relative size-2.5 rounded-full bg-pop" />
      </span>
      {children}
    </p>
  );
}
