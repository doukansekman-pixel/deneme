import { createFileRoute, Link } from "@tanstack/react-router";

import { StructuredData } from "../components/StructuredData";
import { ScrollDepthHero } from "../components/ScrollDepthHero";
import { TiltImage } from "../components/TiltImage";
import { Reveal3D } from "../components/Reveal3D";
import { MenuCta } from "../components/MenuCta";
import { SiteFooter } from "../components/SiteFooter";
import { getPublicMenuData } from "../lib/api/public.functions";

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

function Nav({
  siteName,
  logoUrl,
  instagramUrl,
}: {
  siteName: string;
  logoUrl: string;
  instagramUrl: string;
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-vb-border/60 bg-vb-bg/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <a href="#top" className="flex items-center">
          <img src={logoUrl || "/assets/logo.png"} alt={siteName} className="h-9 w-auto" />
        </a>
        <div className="flex items-center gap-6">
          <Link
            to="/menu"
            className="font-vb-mono text-xs uppercase tracking-[0.15em] text-vb-text-secondary transition-colors hover:text-vb-text"
          >
            Menü
          </Link>
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

// A photo + a short editorial claim, alternating sides down the page. The
// site's "more 3D" pass: the photo tilts on pointer (TiltImage) and the
// whole block settles into place on first scroll-into-view (Reveal3D).
function FeatureSplit({
  imageSrc,
  imageAlt,
  imageSide,
  eyebrow,
  heading,
  body,
  cta,
}: {
  imageSrc: string;
  imageAlt: string;
  imageSide: "left" | "right";
  eyebrow: string;
  heading: string;
  body: string;
  cta?: { label: string; href: string };
}) {
  const photo = (
    <Reveal3D className={imageSide === "left" ? "md:order-1" : "md:order-2"}>
      <TiltImage
        src={imageSrc}
        alt={imageAlt}
        loading="lazy"
        className="aspect-[4/3] w-full rounded-md object-cover"
      />
    </Reveal3D>
  );

  const copy = (
    <Reveal3D className={imageSide === "left" ? "md:order-2" : "md:order-1"}>
      <div className="flex h-full flex-col justify-center">
        <h3 className="font-vb-mono text-xs uppercase tracking-[0.2em] text-vb-accent">{eyebrow}</h3>
        <h2 className="mt-4 font-vb-display text-2xl font-semibold tracking-tight text-vb-text md:text-3xl">
          {heading}
        </h2>
        <p className="mt-4 max-w-md text-vb-text-secondary">{body}</p>
        {cta ? (
          <div className="mt-6">
            <MenuCta href={cta.href}>{cta.label}</MenuCta>
          </div>
        ) : null}
      </div>
    </Reveal3D>
  );

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-14">
        {photo}
        {copy}
      </div>
    </section>
  );
}

// The one lighter, gold-toned band on an otherwise dark espresso page - a
// deliberate rhythm break borrowed from the real venue's own site, built
// from our own photos rather than copied wholesale. Dark text here since
// the accent token itself is a light gold (reads as text/hover elsewhere
// on the dark body, and as this band's fill).
function AtmosphereBand() {
  return (
    <section className="bg-vb-accent py-20 text-vb-bg">
      <div className="mx-auto grid max-w-5xl items-center gap-8 px-6 md:grid-cols-[1fr_1.1fr_1fr]">
        <Reveal3D>
          <TiltImage
            src="/assets/gallery-shisha-prep.jpg"
            alt="Shisha wird vorbereitet"
            loading="lazy"
            className="aspect-[3/4] w-full rounded-md object-cover"
          />
        </Reveal3D>
        <Reveal3D>
          <div className="rounded-md bg-vb-bg/10 px-8 py-10 text-center">
            <h2 className="font-vb-display text-2xl font-semibold tracking-tight md:text-3xl">
              Wohlfühl-Lounge in Weiterstadt
            </h2>
            <p className="mx-auto mt-4 max-w-xs text-vb-bg/75">
              Ob mit Freunden nach der Arbeit oder für einen ruhigen Abend zu zweit, in der Vype
              Lounge kommt man an und bleibt gerne.
            </p>
          </div>
        </Reveal3D>
        <Reveal3D>
          <TiltImage
            src="/assets/gallery-interior-2.jpg"
            alt="Lounge-Bereich der Vype Lounge"
            loading="lazy"
            className="aspect-[3/4] w-full rounded-md object-cover"
          />
        </Reveal3D>
      </div>
    </section>
  );
}

function MenuTeaser() {
  return (
    <Reveal3D className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h2 className="font-vb-display text-3xl font-semibold tracking-tight text-vb-text">Karte</h2>
      <p className="mx-auto mt-4 max-w-md text-vb-text-secondary">
        Shisha, Cocktails, Snacks und mehr. Alle Preise und Beschreibungen findest du auf unserer
        Karte.
      </p>
      <div className="mt-6 flex justify-center">
        <MenuCta href="/menu">Zur Karte</MenuCta>
      </div>
    </Reveal3D>
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
            // Search by the venue's actual registered Google Maps business
            // name + address (from the venue's own Maps place link) so the
            // embed shows the named business card, not just a bare
            // lat/lng pin with no label.
            src="https://www.google.com/maps?q=Vype+Lounge+Shisha-Bar,+Darmst%C3%A4dter+Str.+75,+64331+Weiterstadt&z=16&output=embed"
            className="h-72 w-full rounded-md border border-vb-border md:h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : null}
      </div>
    </section>
  );
}

function Index() {
  const { settings } = Route.useLoaderData();

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
      <Nav siteName={settings.site_name} logoUrl={settings.logo_url} instagramUrl={settings.instagram_url} />
      <ScrollDepthHero
        imageSrc="/assets/hero-lounge.jpg"
        imageAlt="Blick in die Vype Lounge: hängende Pflanzen, warmes Licht und die Marmorbar"
        tagline={settings.tagline || settings.site_name}
      />
      <About aboutText={settings.about_text} />
      <FeatureSplit
        imageSrc="/assets/menu-item-drinks.jpg"
        imageAlt="Cocktail der Vype Lounge"
        imageSide="right"
        eyebrow="Cocktails"
        heading="Der passende Begleiter zu jeder Shisha"
        body="Fruchtige Mocktails, klassische Softdrinks und alles dazwischen, jeden Nachmittag ab Öffnung frisch gemixt."
      />
      <FeatureSplit
        imageSrc="/assets/gallery-interior-1.jpg"
        imageAlt="Lounge-Bereich mit hängenden Pflanzen"
        imageSide="left"
        eyebrow="Ambiente"
        heading="Entspannte Atmosphäre"
        body="Sanftes Licht, ruhige Musik und Sitzecken, in denen man gerne länger bleibt. Aus einem kurzen Besuch wird bei uns schnell ein langer Abend."
        cta={{ label: "Impressionen ansehen", href: "/impressionen" }}
      />
      <AtmosphereBand />
      <MenuTeaser />
      <Visit
        address={settings.address}
        hours={settings.hours}
        wifiSsid={settings.wifi_ssid}
        wifiPassword={settings.wifi_password}
      />
      <SiteFooter siteName={settings.site_name} logoUrl={settings.logo_url} instagramUrl={settings.instagram_url} />
    </div>
  );
}
