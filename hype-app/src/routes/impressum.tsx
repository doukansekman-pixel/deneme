import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum - Hype Bar" },
      { name: "robots", content: "index, nofollow" },
    ],
  }),
  component: Impressum,
});

function Impressum() {
  return (
    <div className="min-h-dvh bg-vb-bg font-vb-display text-vb-text">
      <header className="sticky top-0 z-10 border-b border-vb-border/60 bg-vb-bg/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-3xl items-center px-6">
          <Link to="/" className="flex items-center">
            <img src="/assets/logo.png" alt="Hype Bar" className="h-6 w-auto" />
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-16 text-vb-text-secondary">
        <h1 className="font-vb-display text-3xl font-semibold tracking-tight text-vb-text">Impressum</h1>
        <p className="mt-2 text-sm">Angaben gemäß § 5 TMG</p>

        <section className="mt-8 space-y-1">
          <p className="text-vb-text">Hype Bar Stadtallendorf</p>
          <p>Niederkleiner Str. 44</p>
          <p>35260 Stadtallendorf</p>
          <p>Deutschland</p>
        </section>

        <section className="mt-8">
          <h2 className="font-vb-mono text-xs uppercase tracking-[0.15em] text-vb-accent">Vertreten durch</h2>
          <p className="mt-2 rounded border border-dashed border-vb-border p-3 text-sm">
            Der vollständige Name der verantwortlichen Person bzw. der Geschäftsführung fehlt noch
            und muss vor Veröffentlichung ergänzt werden.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-vb-mono text-xs uppercase tracking-[0.15em] text-vb-accent">Kontakt</h2>
          <p className="mt-2 rounded border border-dashed border-vb-border p-3 text-sm">
            E-Mail-Adresse fehlt noch und muss vor Veröffentlichung ergänzt werden.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-vb-mono text-xs uppercase tracking-[0.15em] text-vb-accent">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <p className="mt-2 rounded border border-dashed border-vb-border p-3 text-sm">
            Ebenfalls noch zu ergänzen: Name und Anschrift der inhaltlich verantwortlichen Person.
          </p>
        </section>

        <p className="mt-10 text-xs text-vb-text-secondary/70">
          Dieses Impressum ist ein Entwurf auf Basis der verfügbaren Angaben. Bitte vor dem
          Livegang durch einen Rechtsbeistand prüfen und die offenen Felder ergänzen.
        </p>
      </main>
    </div>
  );
}
