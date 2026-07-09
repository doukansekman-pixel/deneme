import { useRef, type PointerEvent } from "react";

import { AutoplayVideo } from "./AutoplayVideo";

// Lightweight pointer-tracked 3D tilt for photo grids (gallery, menu item
// thumbnails) - the site's "more 3D" pass. Pure CSS transform + a pointer
// listener, no WebGL/3D asset/library. Reduced-motion users get the flat
// image (no listener attached, no initial transform to un-set).
//
// Two extra depth cues beyond the tilt itself, both purely decorative
// (aria-hidden) and inert until hover: a blurred accent-colored glow plate
// sitting behind the frame (the photo reads as floating above the page
// rather than printed on it), and a soft gloss sheen that tracks the same
// pointer position across the image (a glassy highlight, reinforcing the
// tilt as a physical surface catching light).
// AI-animated depth footage (real photo, subtle camera motion) uses this
// same component and tilt/glow treatment as a static photo - just swap the
// element based on the file extension the admin-set URL points to, so the
// "Görsel URL" field in admin doesn't need a separate video field.
const VIDEO_EXTENSIONS = [".mp4", ".webm"];
function isVideoSrc(src: string): boolean {
  return VIDEO_EXTENSIONS.some((ext) => src.toLowerCase().endsWith(ext));
}

export function TiltImage({
  src,
  alt,
  className,
  loading,
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `perspective(700px) rotateX(${(-py * 10).toFixed(2)}deg) rotateY(${(px * 10).toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;
    if (sheenRef.current) {
      sheenRef.current.style.opacity = "0.4";
      sheenRef.current.style.backgroundPosition = `${(px + 0.5) * 100}% ${(py + 0.5) * 100}%`;
    }
  }

  function onPointerLeave() {
    const node = ref.current;
    if (node) node.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    if (sheenRef.current) sheenRef.current.style.opacity = "0";
  }

  return (
    <div className="group relative">
      <div
        aria-hidden
        className="absolute -inset-3 -z-10 rounded-lg bg-gradient-to-br from-vb-accent/30 via-vb-accent/10 to-transparent opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
      />
      <div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="relative overflow-hidden rounded-md shadow-[0_18px_40px_-20px_rgba(0,0,0,0.6)] transition-transform duration-200 ease-out will-change-transform"
      >
        {isVideoSrc(src) ? (
          <AutoplayVideo src={src} className={className} ariaLabel={alt} />
        ) : (
          <img src={src} alt={alt} loading={loading} className={className} />
        )}
        <div
          ref={sheenRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(245,239,228,0.28), transparent 60%)",
          }}
        />
      </div>
    </div>
  );
}
