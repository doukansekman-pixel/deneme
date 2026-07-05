import { useEffect, useRef } from "react";

import { MenuCta } from "./MenuCta";

// The page's signature motion: as the guest scrolls past the hero, the photo
// tilts back and sinks into the page (perspective + rotateX + scale), like a
// card settling into place, instead of a static image or a passive loop.
// Scroll-linked, never opacity-gated (screenshot-safe): the frame is fully
// painted at scroll 0 and the transform is the only thing that moves.
export function ScrollDepthHero({
  imageSrc,
  imageAlt,
  tagline,
}: {
  imageSrc: string;
  imageAlt: string;
  tagline: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frame = frameRef.current;
    if (!frame) return;

    let ticking = false;
    function apply() {
      ticking = false;
      const distance = window.innerHeight;
      const progress = Math.min(Math.max(window.scrollY / distance, 0), 1);
      const scale = 1 - progress * 0.14;
      const rotate = progress * 8;
      const translate = progress * 40;
      if (frame) {
        frame.style.transform = `translateY(${translate}px) scale(${scale}) rotateX(${rotate}deg)`;
      }
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    }
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-[85dvh] items-end overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      <div
        ref={frameRef}
        className="absolute inset-0 origin-bottom motion-reduce:!transform-none"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-vb-bg via-vb-bg/55 to-vb-bg/10"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(226,56,95,0.18),_transparent_60%)]"
        />
      </div>
      <div className="relative mx-auto w-full max-w-5xl px-6 pb-16 pt-40 motion-safe:animate-[vb-fade-up_0.8s_ease-out]">
        <h1 className="max-w-xl font-vb-display text-4xl font-semibold leading-none tracking-tighter text-vb-text md:text-6xl">
          {tagline}
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-vb-text-secondary">
          Shisha, Cocktails und die richtige Musik, jeden Tag ab dem Nachmittag.
        </p>
        <div className="mt-8">
          <MenuCta href="#menu">Zur Karte</MenuCta>
        </div>
      </div>
    </section>
  );
}
