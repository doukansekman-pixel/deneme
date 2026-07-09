// Soft drifting haze over the hero photo - three overlapping blurred blobs
// in the cream/gold palette, blended with `screen` so they lighten the
// photo like mist rather than sitting on top of it as flat shapes. Purely
// decorative (aria-hidden), frozen for prefers-reduced-motion via
// `motion-safe:animate-*`.
export function SmokeLayer() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ mixBlendMode: "screen" }}>
      <div
        className="absolute -left-[10%] top-[8%] h-[60%] w-[70%] rounded-full blur-3xl motion-safe:animate-[vb-smoke-drift_28s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, rgba(245,239,228,0.18), transparent 70%)" }}
      />
      <div
        className="absolute -right-[15%] top-[30%] h-[55%] w-[65%] rounded-full blur-3xl motion-safe:animate-[vb-smoke-drift_35s_ease-in-out_infinite_reverse]"
        style={{ background: "radial-gradient(circle, rgba(201,168,118,0.16), transparent 70%)" }}
      />
      <div
        className="absolute left-[15%] -bottom-[12%] h-[45%] w-[55%] rounded-full blur-3xl motion-safe:animate-[vb-smoke-drift_24s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, rgba(245,239,228,0.12), transparent 70%)" }}
      />
    </div>
  );
}
