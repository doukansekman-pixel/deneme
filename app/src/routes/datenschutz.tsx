import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutz - Vype Lounge" },
      { name: "robots", content: "index, nofollow" },
    ],
  }),
  component: Datenschutz,
});

function Datenschutz() {
  return (
    <div className="min-h-dvh bg-vb-bg font-vb-display text-vb-text">
      <header className="sticky top-0 z-10 border-b border-vb-border/60 bg-vb-bg/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-3xl items-center px-6">
          <Link to="/" className="font-vb-display text-sm font-semibold tracking-[0.15em] text-vb-text">
            VYPE LOUNGE
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-2xl space-y-8 px-6 py-16 text-vb-text-secondary">
        <div>
          <h1 className="font-vb-display text-3xl font-semibold tracking-tight text-vb-text">
            Datenschutzerklärung
          </h1>
          <p className="mt-3 text-sm">
            Verantwortlich für die Datenverarbeitung auf dieser Website ist die Vype Lounge,
            Darmstädter Str. 75, 64331 Weiterstadt, E-Mail: vypelounge@gmail.com.
          </p>
        </div>

        <section>
          <h2 className="font-vb-mono text-xs uppercase tracking-[0.15em] text-vb-accent">
            Hosting und Server-Logfiles
          </h2>
          <p className="mt-2 text-sm leading-relaxed">
            Diese Website wird bei einem externen Dienstleister gehostet. Beim Aufruf der Seite
            erfasst der Hoster automatisch technische Zugriffsdaten (etwa IP-Adresse, Datum und
            Uhrzeit des Zugriffs, aufgerufene Seite, Browsertyp) in sogenannten Server-Logfiles.
            Diese Daten dienen ausschließlich dem sicheren und stabilen Betrieb der Website und
            werden nicht mit anderen Daten zusammengeführt.
          </p>
        </section>

        <section>
          <h2 className="font-vb-mono text-xs uppercase tracking-[0.15em] text-vb-accent">
            Keine Cookies zur Nutzeranalyse
          </h2>
          <p className="mt-2 text-sm leading-relaxed">
            Diese Website setzt keine Analyse- oder Marketing-Cookies ein. Es findet kein Tracking
            des Nutzerverhaltens statt.
          </p>
        </section>

        <section>
          <h2 className="font-vb-mono text-xs uppercase tracking-[0.15em] text-vb-accent">
            Verwaltungsbereich
          </h2>
          <p className="mt-2 text-sm leading-relaxed">
            Der passwortgeschützte Verwaltungsbereich dieser Website dient ausschließlich dem
            Betreiber zur Pflege der Speisekarte. Beim Login wird ein technisch notwendiges,
            verschlüsseltes Sitzungs-Cookie gesetzt. Dieses Cookie wird nicht zu Analyse- oder
            Werbezwecken verwendet.
          </p>
        </section>

        <section>
          <h2 className="font-vb-mono text-xs uppercase tracking-[0.15em] text-vb-accent">
            Ihre Rechte
          </h2>
          <p className="mt-2 text-sm leading-relaxed">
            Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung
            der Verarbeitung Ihrer personenbezogenen Daten sowie ein Beschwerderecht bei einer
            Datenschutzaufsichtsbehörde. Wenden Sie sich dazu an die oben genannte E-Mail-Adresse.
          </p>
        </section>

        <p className="text-xs text-vb-text-secondary/70">
          Diese Erklärung ist ein Entwurf auf Basis der aktuell verwendeten Technik und ersetzt
          keine rechtliche Prüfung. Bitte vor dem Livegang durch einen Rechtsbeistand freigeben
          lassen, insbesondere sobald weitere Dienste (Analyse, Reservierung, Newsletter) dazukommen.
        </p>
      </main>
    </div>
  );
}
