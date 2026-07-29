import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { getPublicMenuData } from "../lib/api/public.functions";
import type { MenuCategory, MenuItemRow } from "../lib/api/public.functions";
import { formatEuro } from "../lib/format";
import { TiltImage } from "../components/TiltImage";
import { Reveal3D } from "../components/Reveal3D";
import { SiteFooter } from "../components/SiteFooter";

export const Route = createFileRoute("/menu")({
  loader: () => getPublicMenuData(),
  head: () => ({
    meta: [
      { title: "Karte - Hype Bar" },
      {
        name: "description",
        content: "Die Karte der Hype Bar in Stadtallendorf: Shisha, Cocktails, Snacks und Preise.",
      },
    ],
  }),
  component: MenuPage,
});

type CategoryGroup = { category: MenuCategory; items: MenuItemRow[] };

// The photo behind each category name only darkens a tight pocket right
// behind the text, not the whole cover - the corners stay fully lit and
// saturated instead of looking flat and washed out.
const CARD_SCRIM =
  "radial-gradient(ellipse 46% 52% at 50% 50%, rgba(10,14,12,0.5) 0%, rgba(10,14,12,0.16) 68%, transparent 100%)";
const VIVID_FILTER = "saturate(1.2) contrast(1.04)";

function CategoryGrid({ groups, onOpen }: { groups: CategoryGroup[]; onOpen: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {groups.map(({ category, items }, index) => (
        <Reveal3D
          key={category.id}
          delay={index * 70}
          className={groups.length % 2 === 1 && index === groups.length - 1 ? "col-span-2" : undefined}
        >
          <button
            onClick={() => onOpen(category.id)}
            className="group relative block aspect-video w-full overflow-hidden rounded border border-vb-border"
          >
            {category.image_url ? (
              <img
                src={category.image_url}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                style={{ filter: VIVID_FILTER }}
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-vb-bg-secondary" />
            )}
            <div className="absolute inset-0" style={{ background: CARD_SCRIM }} aria-hidden />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
              <span
                className="font-vb-mono text-[0.65rem] uppercase tracking-[0.2em] text-vb-accent"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.65)" }}
              >
                Kategorie
              </span>
              <span
                className="mt-1 font-vb-display text-lg font-semibold leading-tight text-vb-cream md:text-2xl"
                style={{ textShadow: "0 2px 14px rgba(0,0,0,0.7)" }}
              >
                {category.name}
              </span>
              <span
                className="mt-2 font-vb-mono text-[0.65rem] text-vb-text-secondary"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.65)" }}
              >
                {items.length} {items.length === 1 ? "Artikel" : "Artikel"}
              </span>
            </div>
          </button>
        </Reveal3D>
      ))}
    </div>
  );
}

function CategoryDetail({
  category,
  items,
  onBack,
}: {
  category: MenuCategory;
  items: MenuItemRow[];
  onBack: () => void;
}) {
  return (
    <div>
      <div className="relative flex min-h-[220px] items-end overflow-hidden rounded border border-vb-border p-7">
        {category.image_url ? (
          <img
            src={category.image_url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: VIVID_FILTER }}
          />
        ) : (
          <div className="absolute inset-0 bg-vb-bg-secondary" />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#10150f]/92 via-[#10150f]/15 to-transparent"
        />
        <button
          onClick={onBack}
          className="absolute left-7 top-6 font-vb-mono text-xs uppercase tracking-[0.14em] text-vb-cream transition-colors hover:text-vb-accent"
        >
          ← Zurück zur Karte
        </button>
        <h2 className="relative font-vb-display text-2xl font-semibold tracking-tight text-vb-cream md:text-4xl">
          {category.name}
        </h2>
      </div>

      <ul className="mt-7 divide-y divide-vb-border border-t border-vb-border">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-4 py-4">
            {item.image_url ? (
              <div className="shrink-0">
                <TiltImage
                  src={item.image_url}
                  alt={item.name}
                  className="h-16 w-16 rounded-md object-cover"
                  loading="lazy"
                />
              </div>
            ) : null}
            <div className="flex flex-1 items-baseline justify-between gap-6">
              <div>
                <p className="text-lg text-vb-text">{item.name}</p>
                {item.description ? (
                  <p className="mt-1 max-w-md text-sm text-vb-text-secondary">{item.description}</p>
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
  );
}

function MenuPage() {
  const { settings, categories, items } = Route.useLoaderData();
  const [openId, setOpenId] = useState<string | null>(null);

  const groups: CategoryGroup[] = categories
    .map((category) => ({
      category,
      items: items.filter((item) => item.category_id === category.id),
    }))
    .filter((group) => group.items.length > 0);

  const openGroup = openId ? (groups.find((g) => g.category.id === openId) ?? null) : null;

  return (
    <div className="min-h-dvh bg-vb-bg font-vb-display text-vb-text">
      <header className="sticky top-0 z-10 border-b border-vb-border/60 bg-vb-bg/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link to="/" className="flex items-center">
            <img src={settings.logo_url || "/assets/logo.png"} alt={settings.site_name} className="h-9 w-auto" />
          </Link>
          <Link
            to="/"
            className="font-vb-mono text-xs uppercase tracking-[0.15em] text-vb-text-secondary transition-colors hover:text-vb-text"
          >
            Startseite
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-vb-display text-3xl font-semibold tracking-tight text-vb-text md:text-4xl">Karte</h1>
        <div className="mt-12">
          {groups.length === 0 ? (
            <p className="text-vb-text-secondary">Die Karte ist bald hier verfügbar.</p>
          ) : openGroup ? (
            <CategoryDetail category={openGroup.category} items={openGroup.items} onBack={() => setOpenId(null)} />
          ) : (
            <CategoryGrid groups={groups} onOpen={setOpenId} />
          )}
        </div>
      </main>

      <SiteFooter siteName={settings.site_name} logoUrl={settings.logo_url} instagramUrl={settings.instagram_url} />
    </div>
  );
}
