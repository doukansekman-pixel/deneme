import { createFileRoute, Link } from "@tanstack/react-router";

import { getPublicMenuData } from "../lib/api/public.functions";
import type { MenuCategory, MenuItemRow } from "../lib/api/public.functions";
import { formatEuro } from "../lib/format";
import { TiltImage } from "../components/TiltImage";
import { SiteFooter } from "../components/SiteFooter";

export const Route = createFileRoute("/menu")({
  loader: () => getPublicMenuData(),
  head: () => ({
    meta: [
      { title: "Karte - Vype Lounge" },
      {
        name: "description",
        content: "Die Karte der Vype Lounge in Weiterstadt: Shisha, Cocktails, Snacks und Preise.",
      },
    ],
  }),
  component: MenuPage,
});

function MenuList({
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
    <div className="space-y-14">
      {grouped.map(({ category, items: categoryItems }) => (
        <div key={category.id}>
          <h3 className="font-vb-mono text-xs uppercase tracking-[0.2em] text-vb-accent">
            {category.name}
          </h3>
          <ul className="mt-5 divide-y divide-vb-border">
            {categoryItems.map((item) => (
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
  );
}

function MenuPage() {
  const { settings, categories, items } = Route.useLoaderData();

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
        <h1 className="font-vb-display text-3xl font-semibold tracking-tight text-vb-text md:text-4xl">
          Karte
        </h1>
        <p className="mt-3 max-w-xl text-vb-text-secondary">
          Shisha, Cocktails, Snacks und mehr, alle Preise in Euro.
        </p>
        <div className="mt-12">
          <MenuList categories={categories} items={items} />
        </div>
      </main>

      <SiteFooter siteName={settings.site_name} logoUrl={settings.logo_url} instagramUrl={settings.instagram_url} />
    </div>
  );
}
