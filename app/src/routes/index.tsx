import { createFileRoute } from "@tanstack/react-router";

import { StructuredData } from "../components/StructuredData";
import { MenuCta } from "../components/MenuCta";
import { getPublicMenuData } from "../lib/api/public.functions";
import type { MenuCategory, MenuItemRow } from "../lib/api/public.functions";

export const Route = createFileRoute("/")({
  loader: () => getPublicMenuData(),
  head: () => ({
    meta: [
      { title: "Vype Bar - Kokteyl. Müzik. Gece." },
      {
        name: "description",
        content:
          "Vype Bar'ın güncel menüsü, adresi ve Instagram'ı. Şehrin merkezinde her gün açığız.",
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
        <a href="#top" className="font-vb-display text-sm font-semibold tracking-[0.15em] text-vb-text">
          {siteName.toUpperCase()}
        </a>
        <div className="flex items-center gap-6">
          <a
            href="#menu"
            className="font-vb-mono text-xs uppercase tracking-[0.15em] text-vb-text-secondary transition-colors hover:text-vb-text"
          >
            Menü
          </a>
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

function Hero({ tagline }: { tagline: string }) {
  return (
    <section id="top" className="relative flex min-h-[85dvh] items-end overflow-hidden">
      <img
        src="/assets/hero.png"
        alt="Vype Bar'da özenle hazırlanmış imza bir kokteylin yakın çekimi, loş ışıklı bar atmosferi"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-vb-bg via-vb-bg/55 to-vb-bg/10"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(226,56,95,0.18),_transparent_60%)]"
      />
      <div className="relative mx-auto w-full max-w-5xl px-6 pb-16 pt-40 motion-safe:animate-[vb-fade-up_0.8s_ease-out]">
        <h1 className="max-w-xl font-vb-display text-4xl font-semibold leading-none tracking-tighter text-vb-text md:text-6xl">
          {tagline}
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-vb-text-secondary">
          Gün batımından gün doğumuna, özenle hazırlanmış kokteyller ve seçme müzikler.
        </p>
        <div className="mt-8">
          <MenuCta href="#menu">Menüyü Gör</MenuCta>
        </div>
      </div>
    </section>
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
                <li key={item.id} className="flex items-baseline justify-between gap-6 py-4">
                  <div>
                    <p className="text-lg text-vb-text">{item.name}</p>
                    {item.description ? (
                      <p className="mt-1 max-w-md text-sm text-vb-text-secondary">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                  <p className="whitespace-nowrap font-vb-mono text-sm text-vb-text-secondary">
                    {item.price}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {grouped.length === 0 ? (
          <p className="text-vb-text-secondary">Menü yakında burada olacak.</p>
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
    <section className="border-t border-vb-border">
      <div
        className={`mx-auto max-w-3xl px-6 py-20 ${hasWifi ? "grid gap-12 md:grid-cols-2" : ""}`}
      >
        <div>
          <h2 className="font-vb-display text-2xl font-semibold tracking-tight text-vb-text">
            Bize Uğrayın
          </h2>
          {address ? <p className="mt-4 text-vb-text-secondary">{address}</p> : null}
          {hours ? <p className="mt-1 font-vb-mono text-sm text-vb-text-secondary">{hours}</p> : null}
        </div>
        {hasWifi ? (
          <div>
            <h2 className="font-vb-display text-2xl font-semibold tracking-tight text-vb-text">
              WiFi
            </h2>
            <p className="mt-4 text-vb-text-secondary">
              Ağ: <span className="font-vb-mono text-vb-text">{wifiSsid}</span>
            </p>
            {wifiPassword ? (
              <p className="mt-1 text-vb-text-secondary">
                Şifre: <span className="font-vb-mono text-vb-text">{wifiPassword}</span>
              </p>
            ) : null}
          </div>
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
        <p className="font-vb-display text-sm tracking-[0.15em] text-vb-text-secondary">
          {siteName.toUpperCase()}
        </p>
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
        <p className="font-vb-mono text-xs text-vb-text-secondary/70">
          © {year} {siteName}
        </p>
        <a href="/admin/login" className="text-xs text-vb-text-secondary/50 hover:text-vb-text-secondary">
          Yönetim
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
      <Hero tagline={settings.tagline || settings.site_name} />
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
