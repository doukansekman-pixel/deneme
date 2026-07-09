// A soft band of drifting haze marking the seam between two sections, in
// place of a hard cut. Kept to a modest fixed height with the glow
// overflowing its own bounds (no negative margins) so it can't disturb the
// layout of the sections on either side. Only used between sections that
// share the page's plain dark background - never placed against
// AtmosphereBand's solid gold fill, where translucent haze would just look
// like a smudge on a flat color.
export function SmokeDivider() {
  return (
    <div aria-hidden className="pointer-events-none relative h-20 md:h-24">
      <div
        className="absolute inset-x-0 top-1/2 mx-auto h-48 w-[130%] max-w-3xl -translate-y-1/2 rounded-full blur-2xl motion-safe:animate-[vb-smoke-drift_26s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(ellipse, rgba(201,168,118,0.35), transparent 68%)" }}
      />
    </div>
  );
}
