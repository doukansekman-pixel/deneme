// Soft drifting haze over the hero photo - three overlapping blurred blobs
// in the cream/gold palette, blended with `screen` so they lighten the
// photo like mist rather than sitting on top of it as flat shapes. Purely
// decorative (aria-hidden), frozen for prefers-reduced-motion via
// `motion-safe:animate-*`.
export function SmokeLayer() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ mixBlendMode: "screen" }}>
      <div
        className="absolute -left-[15%] top-[2%] h-[75%] w-[85%] rounded-full blur-2xl motion-safe:animate-[vb-smoke-drift_22s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, rgba(245,239,228,0.42), transparent 68%)" }}
      />
      <div
        className="absolute -right-[20%] top-[22%] h-[70%] w-[80%] rounded-full blur-2xl motion-safe:animate-[vb-smoke-drift_28s_ease-in-out_infinite_reverse]"
        style={{ background: "radial-gradient(circle, rgba(201,168,118,0.38), transparent 68%)" }}
      />
      <div
        className="absolute left-[10%] -bottom-[18%] h-[60%] w-[70%] rounded-full blur-2xl motion-safe:animate-[vb-smoke-drift_18s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, rgba(245,239,228,0.3), transparent 68%)" }}
      />
    </div>
  );
}
