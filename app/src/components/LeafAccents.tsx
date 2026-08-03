import { useEffect, useRef, useState } from "react";

// Renders the shared leaf silhouette once, globally - every <LeafAccents />
// instance references it by id via <use>, so the actual path data is only
// ever parsed once regardless of how many sections use it. Mount this once
// near the top of the page.
export function LeafShapeDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      <defs>
        <symbol id="vb-leaf-shape" viewBox="0 0 100 160">
          <path
            d="M50 6 C78 34 92 76 92 100 C92 132 74 152 50 158 C26 152 8 132 8 100 C8 76 22 34 50 6 Z"
            fill="currentColor"
          />
          <path
            d="M50 14 C46 60 46 110 50 150 M50 42 L27 58 M50 42 L73 58 M50 80 L23 98 M50 80 L77 98 M50 116 L31 130 M50 116 L69 130"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
        </symbol>
      </defs>
    </svg>
  );
}

type LeafConfig = {
  // Starting offset (px) and rotation the leaf drifts in from, and the
  // rotation + opacity it settles to once the section has scrolled into
  // view - a momentary "swept in" transition, not a permanent sticker.
  tx: number;
  ty: number;
  r0: number;
  r1: number;
  delay: number;
  settleOpacity: number;
  width: number;
  height: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
};

// A handful of named arrangements (position/size/timing per leaf) reused
// across the homepage's sections, so each section gets a distinct look
// without every call site hand-tuning its own leaf layout.
const LEAF_LAYOUTS: Record<"wide" | "right" | "left" | "visit", LeafConfig[]> = {
  wide: [
    { tx: -150, ty: -40, r0: -25, r1: -4, delay: 0, settleOpacity: 0.5, width: 45, height: 72, left: "10%", top: "14%" },
    { tx: 150, ty: 110, r0: 22, r1: 16, delay: 130, settleOpacity: 0.4, width: 34, height: 54, right: "12%", top: "62%" },
    { tx: 90, ty: -110, r0: 12, r1: 2, delay: 260, settleOpacity: 0.3, width: 28, height: 45, right: "24%", top: "8%" },
  ],
  right: [
    { tx: 130, ty: -90, r0: 35, r1: 10, delay: 0, settleOpacity: 0.45, width: 48, height: 77, right: "10%", top: "10%" },
    { tx: -160, ty: 60, r0: -18, r1: -6, delay: 150, settleOpacity: 0.4, width: 37, height: 59, left: "8%", top: "58%" },
  ],
  left: [
    { tx: -140, ty: -70, r0: -28, r1: -8, delay: 0, settleOpacity: 0.45, width: 46, height: 74, left: "8%", top: "12%" },
    { tx: 150, ty: 90, r0: 20, r1: 8, delay: 150, settleOpacity: 0.4, width: 36, height: 58, right: "10%", top: "60%" },
  ],
  visit: [
    { tx: 140, ty: 70, r0: 28, r1: 8, delay: 0, settleOpacity: 0.4, width: 40, height: 64, right: "8%", top: "58%" },
    { tx: -120, ty: -70, r0: -16, r1: -2, delay: 150, settleOpacity: 0.32, width: 33, height: 53, left: "10%", top: "14%" },
  ],
} satisfies Record<string, LeafConfig[]>;

// A few leaf silhouettes that drift in from the edges, rotating gently,
// as the section scrolls into view for the first time - then settle to a
// faint ambient presence. Mirrors the same on-mount-into-view identity as
// Reveal3D, but as a decorative background layer instead of the content
// itself. Needs a `position: relative` ancestor (the section) to anchor to.
export function LeafAccents({
  variant,
  className = "text-vb-accent",
}: {
  variant: keyof typeof LEAF_LAYOUTS;
  // Leaf fill color, via `currentColor` - override for sections whose
  // background is already the accent gold (would otherwise disappear).
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {LEAF_LAYOUTS[variant].map((leaf, i) => (
        <svg
          key={i}
          viewBox="0 0 100 160"
          className="absolute motion-safe:transition-[opacity,transform] motion-safe:duration-[1200ms] motion-safe:ease-out motion-reduce:opacity-[var(--settle,0)]"
          style={{
            width: leaf.width,
            height: leaf.height,
            top: leaf.top,
            bottom: leaf.bottom,
            left: leaf.left,
            right: leaf.right,
            opacity: visible ? leaf.settleOpacity : 0,
            transform: visible
              ? `translate(0, 0) rotate(${leaf.r1}deg) scale(1)`
              : `translate(${leaf.tx}px, ${leaf.ty}px) rotate(${leaf.r0}deg) scale(0.7)`,
            transitionDelay: visible ? `${leaf.delay}ms` : "0ms",
          }}
        >
          <use href="#vb-leaf-shape" />
        </svg>
      ))}
    </div>
  );
}
