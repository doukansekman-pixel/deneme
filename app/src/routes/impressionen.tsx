import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/impressionen")({
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

const PHOTOS = [
  { src: "/assets/hero-lounge.jpg", alt: "Lounge-Bereich mit hängenden Pflanzen und warmem Licht" },
  { src: "/assets/gallery-interior-1.jpg", alt: "Sitzbereich an der Marmorbar" },
  { src: "/assets/gallery-shisha-prep.jpg", alt: "Frisch aufgesetzte Shisha an der Bar" },
  { src: "/assets/gallery-cocktail.jpg", alt: "Cocktail mit frischer Minze" },
  { src: "/assets/gallery-interior-2.jpg", alt: "Blick durch die Lounge Richtung Bar" },
  { src: "/assets/gallery-storefront-day.jpg", alt: "Eingang der Vype Lounge bei Tag" },
  { src: "/assets/gallery-storefront-night.jpg", alt: "Leuchtschrift VYPE am Eingang bei Nacht" },
];

function Impressionen() {
  return (
    <div className="min-h-dvh bg-vb-bg font-vb-display text-vb-text">
      <header className="sticky top-0 z-10 border-b border-vb-border/60 bg-vb-bg/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link to="/" className="font-vb-display text-sm font-semibold tracking-[0.15em] text-vb-text">
            VYPE LOUNGE
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
          {PHOTOS.map((photo) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="aspect-[4/5] w-full rounded-md object-cover"
            />
          ))}
        </div>
      </main>
    </div>
  );
}
