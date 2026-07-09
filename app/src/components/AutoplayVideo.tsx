import { useEffect, useRef } from "react";

// React's `muted` JSX prop doesn't reliably sync to the DOM property before
// the browser's autoplay check runs, so autoplay silently fails and shows
// the blocked-play icon even though the attribute is present in markup.
// Setting `.muted` imperatively via ref (and re-triggering `.play()`) is the
// standard workaround.
export function AutoplayVideo({
  src,
  className,
  ariaLabel,
}: {
  src: string;
  className?: string;
  ariaLabel: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.muted = true;
    node.play().catch(() => {});
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      aria-label={ariaLabel}
    />
  );
}
