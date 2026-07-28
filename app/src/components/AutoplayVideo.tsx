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
// Safari also refuses to paint any frame at all for a <video> that hasn't
// started playing yet unless a `poster` is set - Chrome shows the first
// frame regardless, so this only ever showed up on iOS. Every generated
// video ships a same-named "-poster.jpg" sibling (see scripts/), so this
// derives the poster from the src by convention instead of requiring every
// caller to pass one and risk forgetting it.
function derivePoster(src: string): string {
  return src.replace(/\.(mp4|webm)$/i, "-poster.jpg");
}

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
  // matters most for the hero, which is large and above the fold. Defaults
  // to the "-poster.jpg" convention if not given explicitly.
  poster?: string;
}) {
  const resolvedPoster = poster ?? derivePoster(src);
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
      poster={resolvedPoster}
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
