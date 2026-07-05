// The page's one CTA garment (design-brief.md CTA inventory): an oversized
// text link whose underline draws in on hover/focus. Its own component, its
// own interaction identity — never reused as a generic button class.
export function MenuCta({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="group relative inline-block font-vb-display text-lg tracking-tight text-vb-text motion-safe:transition-colors motion-safe:duration-300 hover:text-vb-accent"
    >
      {children}
      <span
        aria-hidden
        className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-vb-text motion-safe:transition-transform motion-safe:duration-300 group-hover:origin-left group-hover:scale-x-0"
      />
      <span
        aria-hidden
        className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-vb-accent motion-safe:transition-transform motion-safe:duration-300 group-hover:origin-left group-hover:scale-x-100"
      />
    </a>
  );
}
