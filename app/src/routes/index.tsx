import { createFileRoute, Link } from "@tanstack/react-router";

import { StructuredData } from "../components/StructuredData";
import { ScrollDepthHero } from "../components/ScrollDepthHero";
import { getPublicMenuData } from "../lib/api/public.functions";
import type { MenuCategory, MenuItemRow } from "../lib/api/public.functions";
import { formatEuro } from "../lib/format";

export const Route = createFileRoute("/")({
  loader: () => getPublicMenuData(),
  head: () => ({
    meta: [
      { title: "Vype Lounge - Shisha, Cocktails & mehr in Weiterstadt" },
      {
        name: "description",
        content:
          "Die aktuelle Karte der Vype Lounge in Weiterstadt: Shisha, Cocktails, Snacks, Adresse und Öffnungszeiten.",
      },
    ],
  }),
  component: Index,
});

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

function Nav({ siteName, instagramUrl }: { siteName: string; instagramUrl: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-vb-border/60 bg-vb-bg/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <a href="#top" className="flex items-center">
          <img src="/assets/logo.png" alt={siteName} className="h-6 w-auto" />
        </a>
        <div className="flex items-center gap-6">
          <a
            href="#menu"
            className="font-vb-mono text-xs uppercase tracking-[0.15em] text-vb-text-secondary transition-colors hover:text-vb-text"
          >
            Menü
          </a>
          <Link
            to="/impressionen"
            className="font-vb-mono text-xs uppercase tracking-[0.15em] text-vb-text-secondary transition-colors hover:text-vb-text"
          >
            Impressionen
          </Link>
          {instagramUrl ? (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-vb-text-secondary transition-colors hover:text-vb-accent"
            >
              <InstagramIcon />
            </a>
          ) : null}
        </div>
      </nav>
    </header>
  );
}

function About({ aboutText }: { aboutText: string }) {
  if (!aboutText) return null;
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <p className="font-vb-display text-2xl leading-relaxed tracking-tight text-vb-text md:text-3xl">
        {aboutText}
      </p>
    </section>
  );
}

function Menu({
  categories,
  items,
}: {
  categories: MenuCategory[];
  items: MenuItemRow[];
}) {
  const grouped = categories
    .map((category) => ({
      category,
      items: items.filter((item) => item.category_id === category.id),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <section id="menu" className="mx-auto max-w-3xl px-6 py-24">
      <h2 className="font-vb-display text-3xl font-semibold tracking-tight text-vb-text">Menü</h2>
      <div className="mt-12 space-y-14">
        {grouped.map(({ category, items: categoryItems }) => (
          <div key={category.id}>
            <h3 className="font-vb-mono text-xs uppercase tracking-[0.2em] text-vb-accent">
              {category.name}
            </h3>
            <ul className="mt-5 divide-y divide-vb-border">
              {categoryItems.map((item) => (
                <li key={item.id} className="flex items-start gap-4 py-4">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-16 w-16 shrink-0 rounded-md object-cover"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="flex flex-1 items-baseline justify-between gap-6">
                    <div>
                      <p className="text-lg text-vb-text">{item.name}</p>
                      {item.description ? (
                        <p className="mt-1 max-w-md text-sm text-vb-text-secondary">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                    <p className="whitespace-nowrap font-vb-mono text-sm text-vb-text-secondary">
                      {formatEuro(item.price_amount)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {grouped.length === 0 ? (
          <p className="text-vb-text-secondary">Die Karte ist bald hier verfügbar.</p>
        ) : null}
      </div>
    </section>
  );
}

function Visit({
  address,
  hours,
  wifiSsid,
  wifiPassword,
}: {
  address: string;
  hours: string;
  wifiSsid: string;
  wifiPassword: string;
}) {
  const hasWifi = wifiSsid.length > 0;
  return (
    <section id="visit" className="border-t border-vb-border">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-20 md:grid-cols-2">
        <div>
          <h2 className="font-vb-display text-2xl font-semibold tracking-tight text-vb-text">
            Besuch uns
          </h2>
          {address ? <p className="mt-4 text-vb-text-secondary">{address}</p> : null}
          {hours ? <p className="mt-1 font-vb-mono text-sm text-vb-text-secondary">{hours}</p> : null}
          {hasWifi ? (
            <div className="mt-8">
              <h3 className="font-vb-mono text-xs uppercase tracking-[0.2em] text-vb-accent">WLAN</h3>
              <p className="mt-2 text-vb-text-secondary">
                Netzwerk: <span className="font-vb-mono text-vb-text">{wifiSsid}</span>
              </p>
              {wifiPassword ? (
                <p className="mt-1 text-vb-text-secondary">
                  Passwort: <span className="font-vb-mono text-vb-text">{wifiPassword}</span>
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
        {address ? (
          <iframe
            title="Vype Lounge auf Google Maps"
            src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
            className="h-72 w-full rounded-md border border-vb-border md:h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : null}
      </div>
    </section>
  );
}

function Footer({ siteName, instagramUrl }: { siteName: string; instagramUrl: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-vb-border">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-10 text-center">
        <img src="/assets/logo.png" alt={siteName} className="h-7 w-auto opacity-80" />
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

function Index() {
  const { settings, categories, items } = Route.useLoaderData();

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BarOrPub",
        name: settings.site_name,
        description: settings.about_text || settings.tagline,
        address: settings.address || undefined,
        ...(settings.instagram_url ? { sameAs: [settings.instagram_url] } : {}),
      },
      {
        "@type": "WebSite",
        name: settings.site_name,
      },
    ],
  });

  return (
    <div className="font-vb-display">
      <StructuredData json={schema} />
      <Nav siteName={settings.site_name} instagramUrl={settings.instagram_url} />
      <ScrollDepthHero
        imageSrc="/assets/hero-lounge.jpg"
        imageAlt="Blick in die Vype Lounge: hängende Pflanzen, warmes Licht und die Marmorbar"
        tagline={settings.tagline || settings.site_name}
      />
      <About aboutText={settings.about_text} />
      <Menu categories={categories} items={items} />
      <Visit
        address={settings.address}
        hours={settings.hours}
        wifiSsid={settings.wifi_ssid}
        wifiPassword={settings.wifi_password}
      />
      <Footer siteName={settings.site_name} instagramUrl={settings.instagram_url} />
    </div>
  );
}
