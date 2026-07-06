import { Link } from "@tanstack/react-router";

// The page's one CTA garment (design-brief.md CTA inventory): an oversized
// text link whose underline draws in on hover/focus. Its own component, its
// own interaction identity — never reused as a generic button class.
// `tone="light"` is for placement over the dark hero photo/scrim, where the
// page's normal dark-on-cream text tokens would be unreadable. Internal
// paths (starting with "/") render as a router Link for client-side nav;
// in-page anchors ("#...") render as a plain <a>.
export function MenuCta({
  href,
  children,
  tone = "dark",
}: {
  href: string;
  children: string;
  tone?: "dark" | "light";
}) {
  const textClass = tone === "light" ? "text-vb-cream" : "text-vb-text";
  const underlineClass = tone === "light" ? "bg-vb-cream" : "bg-vb-text";
  const className = `group relative inline-block font-vb-display text-lg tracking-tight ${textClass} motion-safe:transition-colors motion-safe:duration-300 hover:text-vb-accent`;

  const underline = (
    <>
      <span
        aria-hidden
        className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 ${underlineClass} motion-safe:transition-transform motion-safe:duration-300 group-hover:origin-left group-hover:scale-x-0`}
      />
      <span
        aria-hidden
        className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-vb-accent motion-safe:transition-transform motion-safe:duration-300 group-hover:origin-left group-hover:scale-x-100"
      />
    </>
  );

  if (href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {children}
        {underline}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {children}
      {underline}
    </Link>
  );
}
