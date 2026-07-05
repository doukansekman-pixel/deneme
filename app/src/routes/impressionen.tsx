import { createFileRoute, Link } from "@tanstack/react-router";

import { getPublicGallery } from "../lib/api/public.functions";

export const Route = createFileRoute("/impressionen")({
  loader: () => getPublicGallery(),
  head: () => ({
    meta: [
      { title: "Impressionen - Vype Lounge" },
      {
        name: "description",
        content: "Ein Blick in die Vype Lounge in Weiterstadt: Bar, Lounge-Bereich und Shisha.",
      },
    ],
  }),
  component: Impressionen,
});

function Impressionen() {
  const photos = Route.useLoaderData();
  return (
    <div className="min-h-dvh bg-vb-bg font-vb-display text-vb-text">
      <header className="sticky top-0 z-10 border-b border-vb-border/60 bg-vb-bg/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link to="/" className="flex items-center">
            <img src="/assets/logo.png" alt="Vype Lounge" className="h-6 w-auto" />
          </Link>
          <Link
            to="/"
            hash="menu"
            className="font-vb-mono text-xs uppercase tracking-[0.15em] text-vb-text-secondary transition-colors hover:text-vb-text"
          >
            Menü
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="font-vb-display text-3xl font-semibold tracking-tight text-vb-text md:text-4xl">
          Impressionen
        </h1>
        <p className="mt-3 max-w-xl text-vb-text-secondary">
          Ein kurzer Blick in die Lounge, bevor du selbst vorbeikommst.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3">
          {photos.map((photo) => (
            <img
              key={photo.id}
              src={photo.image_url}
              alt={photo.caption || "Vype Lounge"}
              loading="lazy"
              className="aspect-[4/5] w-full rounded-md object-cover"
            />
          ))}
        </div>
        {photos.length === 0 ? (
          <p className="mt-12 text-vb-text-secondary">Weitere Bilder folgen in Kürze.</p>
        ) : null}
      </main>
    </div>
  );
}
