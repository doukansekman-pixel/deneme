import { createFileRoute, Link } from "@tanstack/react-router";

import { getPublicMenuData } from "../lib/api/public.functions";

export const Route = createFileRoute("/datenschutz")({
  loader: () => getPublicMenuData(),
  head: () => ({
    meta: [
      { title: "Datenschutz - Vype Lounge" },
      { name: "robots", content: "index, nofollow" },
    ],
  }),
  component: Datenschutz,
});

function DatenschutzBody({ text }: { text: string }) {
  const lines = text.split("\n").filter((line) => line.trim().length > 0);

  return (
    <>
      {lines.map((line, index) => {
        const key = `${index}-${line.slice(0, 20)}`;
        if (/^\d+\.\s/.test(line)) {
          return (
            <h2 key={key} className="mt-8 font-vb-display text-xl font-semibold text-vb-text first:mt-0">
              {line}
            </h2>
          );
        }
        if (line.length < 60) {
          return (
            <h3 key={key} className="mt-5 font-vb-mono text-xs uppercase tracking-[0.1em] text-vb-accent">
              {line}
            </h3>
          );
        }
        return (
          <p key={key} className="mt-2 text-sm leading-relaxed">
            {line}
          </p>
        );
      })}
    </>
  );
}

function Datenschutz() {
  const { settings } = Route.useLoaderData();

  return (
    <div className="min-h-dvh bg-vb-bg font-vb-display text-vb-text">
      <header className="sticky top-0 z-10 border-b border-vb-border/60 bg-vb-bg/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-3xl items-center px-6">
          <Link to="/" className="flex items-center">
            <img src="/assets/logo.png" alt="Vype Lounge" className="h-6 w-auto" />
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-16 text-vb-text-secondary">
        <h1 className="font-vb-display text-3xl font-semibold tracking-tight text-vb-text">
          Datenschutzerklärung
        </h1>
        {settings.datenschutz_text ? (
          <div className="mt-8">
            <DatenschutzBody text={settings.datenschutz_text} />
          </div>
        ) : (
          <p className="mt-8 text-sm">Die Datenschutzerklärung wird in Kürze ergänzt.</p>
        )}
      </main>
    </div>
  );
}
