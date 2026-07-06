import { useEffect, useRef, useState, type ReactNode } from "react";

// On-mount reveal (editorial tier's approved motion budget), given a 3D
// character to match the hero's "settling into place" identity: sections
// tilt back from a slight rotateX + rise into their resting position the
// first time they enter the viewport. Not scroll-scrubbed like the hero -
// a one-shot settle, then done. Reduced-motion users get the resting state
// immediately, no observer attached.
export function Reveal3D({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  // Stagger in ms, for grids where every item should settle in sequence
  // rather than all at once (e.g. AtmosphereBand's three columns).
  delay?: number;
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
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={{ perspective: "1000px" }}>
      <div
        className="motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out"
        style={{
          transform: visible ? "translateY(0) rotateX(0deg) scale(1)" : "translateY(28px) rotateX(8deg) scale(0.98)",
          opacity: visible ? 1 : 0,
          transitionDelay: visible && delay ? `${delay}ms` : "0ms",
        }}
      >
        {children}
      </div>
    </div>
  );
}
