import { useEffect, useRef } from "react";

// Safari (WebKit) is stricter than Chrome about when a muted <video> is
// actually allowed to autoplay: React's `muted` JSX prop alone isn't
// enough, and a single `.play()` call right on mount can lose the race
// against WebKit's own readiness checks. This retries `.play()` on the
// media's own "ready" events too (canplay/loadeddata), and again once the
// element scrolls into view, which covers the cases a single early call
// misses. `disablePictureInPicture` and `webkit-playsinline` are the
// legacy Safari/iOS equivalents of the modern attributes, added for older
// WebKit builds that only recognize the prefixed/lowercase forms.
export function AutoplayVideo({
  src,
  className,
  ariaLabel,
  poster,
}: {
  src: string;
  className?: string;
  ariaLabel: string;
  // Shown immediately while the video downloads, instead of a blank frame -
  // matters most for the hero, which is large and above the fold.
  poster?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.muted = true;
    node.defaultMuted = true;

    function tryPlay() {
      node?.play().catch(() => {});
    }

    tryPlay();
    node.addEventListener("loadeddata", tryPlay);
    node.addEventListener("canplay", tryPlay);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) tryPlay();
      },
      { threshold: 0.1 },
    );
    observer.observe(node);

    return () => {
      node.removeEventListener("loadeddata", tryPlay);
      node.removeEventListener("canplay", tryPlay);
      observer.disconnect();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      className={className}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      webkit-playsinline="true"
      aria-label={ariaLabel}
    />
  );
}
