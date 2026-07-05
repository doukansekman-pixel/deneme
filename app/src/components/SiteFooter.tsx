import { Link } from "@tanstack/react-router";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function SiteFooter({
  siteName,
  logoUrl,
  instagramUrl,
}: {
  siteName: string;
  logoUrl: string;
  instagramUrl: string;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-vb-border">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-10 text-center">
        <img src={logoUrl || "/assets/logo.png"} alt={siteName} className="h-10 w-auto opacity-80" />
        {instagramUrl ? (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-vb-text-secondary transition-colors hover:text-vb-accent"
          >
            <InstagramIcon />
            Instagram
          </a>
        ) : null}
        <div className="flex items-center gap-4 font-vb-mono text-xs text-vb-text-secondary/70">
          <Link to="/impressum" className="hover:text-vb-text-secondary">
            Impressum
          </Link>
          <span aria-hidden>·</span>
          <Link to="/datenschutz" className="hover:text-vb-text-secondary">
            Datenschutz
          </Link>
        </div>
        <p className="font-vb-mono text-xs text-vb-text-secondary/70">
          © {year} {siteName}
        </p>
        <a href="/admin/login" className="text-xs text-vb-text-secondary/50 hover:text-vb-text-secondary">
          Verwaltung
        </a>
      </div>
    </footer>
  );
}
