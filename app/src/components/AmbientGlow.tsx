// Two large, softly blurred color washes drifting slowly behind a section -
// the page's atmosphere/depth layer on otherwise flat dark sections (About,
// Karte teaser, Visit). Purely decorative (aria-hidden), frozen for
// prefers-reduced-motion via `motion-safe:animate-*`. The host section must
// be `relative isolate` so this stays clipped to it instead of bleeding into
// neighbors.
export function AmbientGlow({ variant = "default" }: { variant?: "default" | "warm" }) {
  const primary = variant === "warm" ? "rgba(201,168,118,0.18)" : "rgba(201,168,118,0.12)";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -left-1/4 top-0 h-[36rem] w-[36rem] rounded-full blur-3xl motion-safe:animate-[vb-drift_22s_ease-in-out_infinite]"
        style={{ background: `radial-gradient(circle, ${primary}, transparent 70%)` }}
      />
      <div
        className="absolute -right-1/4 bottom-0 h-[30rem] w-[30rem] rounded-full blur-3xl motion-safe:animate-[vb-drift_26s_ease-in-out_infinite_reverse]"
        style={{ background: "radial-gradient(circle, rgba(242,236,226,0.05), transparent 70%)" }}
      />
    </div>
  );
}
