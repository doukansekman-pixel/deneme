import { useEffect, useRef, type PointerEvent } from "react";

import { AutoplayVideo } from "./AutoplayVideo";
import { MenuCta } from "./MenuCta";

// AI-animated depth footage (real photo, subtle camera motion) plays here
// instead of a static <img> when the admin-set hero image URL points to a
// video file - same "Görsel URL" field in admin either way.
const VIDEO_EXTENSIONS = [".mp4", ".webm"];
function isVideoSrc(src: string): boolean {
  return VIDEO_EXTENSIONS.some((ext) => src.toLowerCase().endsWith(ext));
}

// The page's signature motion: as the guest scrolls past the hero, the photo
// tilts back and sinks into the page (perspective + rotateX + scale), like a
// card settling into place, instead of a static image or a passive loop.
// Scroll-linked, never opacity-gated (screenshot-safe): the frame is fully
// painted at scroll 0 and the transform is the only thing that moves.
//
// A pointer-tracked spotlight sits on top of that base effect (mouse only,
// desktop) - a soft highlight that follows the cursor across the photo,
// independent of the scroll transform.
export function ScrollDepthHero({
  imageSrc,
  imageAlt,
  tagline,
  subtitle,
}: {
  imageSrc: string;
  imageAlt: string;
  tagline: string;
  subtitle: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frame = frameRef.current;
    if (!frame) return;

    let ticking = false;
    function apply() {
      ticking = false;
      const distance = window.innerHeight;
      const progress = Math.min(Math.max(window.scrollY / distance, 0), 1);
      const scale = 1 - progress * 0.2;
      const rotate = progress * 12;
      const translate = progress * 60;
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

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = spotlightRef.current;
    if (!node) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    node.style.background = `radial-gradient(480px circle at ${x}% ${y}%, rgba(245,239,228,0.16), transparent 60%)`;
  }

  function onPointerLeave() {
    if (spotlightRef.current) spotlightRef.current.style.background = "transparent";
  }

  return (
    <section
      id="top"
      className="relative flex min-h-[85dvh] items-end overflow-hidden"
      style={{ perspective: "1200px" }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div
        ref={frameRef}
        className="absolute inset-0 origin-bottom motion-reduce:!transform-none"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {isVideoSrc(imageSrc) ? (
          <AutoplayVideo src={imageSrc} className="h-full w-full object-cover" ariaLabel={imageAlt} />
        ) : (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
        )}
                <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#1a120c]/85 to-transparent"
        />
      </div>
      <div ref={spotlightRef} aria-hidden className="absolute inset-0 transition-[background] duration-300" />

      <div className="relative mx-auto w-full max-w-5xl px-6 pb-16 pt-40 motion-safe:animate-[vb-fade-up_0.8s_ease-out]">
        <h1 className="max-w-xl font-vb-display text-4xl font-semibold leading-none tracking-tighter text-vb-cream md:text-6xl">
          {tagline}
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-vb-cream/80">{subtitle}</p>
        <div className="mt-8">
          <MenuCta href="/menu" tone="light">Zur Karte</MenuCta>
        </div>
      </div>
    </section>
  );
}
