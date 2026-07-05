import { useRef, type PointerEvent } from "react";

// Lightweight pointer-tracked 3D tilt for photo grids (gallery, menu item
// thumbnails) - the site's "more 3D" pass. Pure CSS transform + a pointer
// listener, no WebGL/3D asset/library. Reduced-motion users get the flat
// image (no listener attached, no initial transform to un-set).
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

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `perspective(700px) rotateX(${(-py * 10).toFixed(2)}deg) rotateY(${(px * 10).toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;
  }

  function onPointerLeave() {
    const node = ref.current;
    if (!node) return;
    node.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="transition-transform duration-200 ease-out will-change-transform"
    >
      <img src={src} alt={alt} loading={loading} className={className} />
    </div>
  );
}
