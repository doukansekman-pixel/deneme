import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportHiggsfieldError } from "../lib/higgsfield-error-reporting";
// Page metadata (browser <title>/favicon + social og: tags) committed into the
// repo by the marketplace meta API and read at BUILD time — no runtime fetch.
// Editing it via the app settings UI rewrites this file and redeploys the app.
import appMetaJson from "../app-meta.json";

declare const __HF_DESIGN_INSPECTOR__: boolean;

// Built-in defaults for any field that isn't set in app-meta.json.
const DEFAULT_TITLE = "Vype Lounge - Shisha, Cocktails & mehr in Weiterstadt";
const DEFAULT_DESCRIPTION =
  "Die aktuelle Karte der Vype Lounge in Weiterstadt: Shisha, Cocktails, Snacks, Adresse und Öffnungszeiten.";

type AppMeta = {
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  favicon_url?: string | null;
  og_video_url?: string | null;
};

const appMeta = appMetaJson as AppMeta;

// Build the document head (title / description / og: / twitter: / favicon) from
// app-meta.json, falling back to the defaults above for any unset field.
const APP_HOST_ZONES = ["higgsfield.app", "higgsfield-dev.app"];
// The site's canonical production origin (slug from website_repo_access).
// og:image/og:video must be absolute per the SEO audit, and preview/prod
// share the same repo, so this is the one stable public URL to anchor them to.
const SITE_ORIGIN = "https://shiny-beach-364.higgsfield.app";

function toOwnAssetUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("/")) return value;
  try {
    const u = new URL(value);
    const isAppHost = APP_HOST_ZONES.some(
      (zone) => u.hostname === zone || u.hostname.endsWith(`.${zone}`),
    );
    if (isAppHost) return u.pathname + u.search;
    return value;
  } catch {
    return value;
  }
}

function toAbsoluteUrl(value: string | null): string | null {
  if (!value) return null;
  return value.startsWith("/") ? `${SITE_ORIGIN}${value}` : value;
}

function buildHead(meta: AppMeta) {
  const title = meta.og_title ?? DEFAULT_TITLE;
  const description = meta.og_description ?? DEFAULT_DESCRIPTION;
  const ogImage = toAbsoluteUrl(toOwnAssetUrl(meta.og_image_url));
  const favicon = toOwnAssetUrl(meta.favicon_url) ?? "/favicon.svg";
  const ogVideo = toAbsoluteUrl(toOwnAssetUrl(meta.og_video_url));

  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" },
      { title },
      { name: "description", content: description },
      { name: "author", content: "Vype Lounge" },
      { name: "theme-color", content: "#211a16" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_ORIGIN },
      { property: "og:site_name", content: "Vype Lounge" },
      { property: "og:locale", content: "de_DE" },
      { name: "twitter:card", content: ogImage ? "summary_large_image" : "summary" },
      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { name: "twitter:image", content: ogImage },
          ]
        : []),
      ...(ogVideo ? [{ property: "og:video", content: ogVideo }] : []),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: favicon },
      { rel: "canonical", href: SITE_ORIGIN },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
    ],
  };
}

function NotFoundComponent() {
  return (
    <div className="grid min-h-dvh place-items-center bg-vb-bg px-4 font-vb-display text-vb-text">
      <div className="max-w-md text-center">
        <p className="font-vb-mono text-sm uppercase tracking-[0.2em] text-vb-accent">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Diese Seite gibt es nicht</h1>
        <p className="mt-2 text-vb-text-secondary">
          Die gesuchte Seite wurde verschoben oder existiert nicht mehr.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block border-b border-vb-accent pb-0.5 text-vb-text transition-colors hover:text-vb-accent"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportHiggsfieldError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="grid min-h-dvh place-items-center bg-vb-bg px-4 font-vb-display text-vb-text">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Etwas ist schiefgelaufen</h1>
        <p className="mt-2 text-vb-text-secondary">
          Die Seite konnte nicht geladen werden. Versuche es erneut oder gehe zur Startseite.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="border-b border-vb-accent pb-0.5 transition-colors hover:text-vb-accent"
          >
            Erneut versuchen
          </button>
          <a href="/" className="border-b border-vb-border pb-0.5 transition-colors hover:border-vb-accent hover:text-vb-accent">
            Startseite
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // Read the committed page metadata at build time (no runtime fetch).
  head: () => buildHead(appMeta),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="de" style={{ colorScheme: "dark" }}>
      <head>
        <HeadContent />
      </head>
      <body className="bg-vb-bg text-vb-text">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if (!__HF_DESIGN_INSPECTOR__) {
      return;
    }

    void import("../module/design-inspector/runtime")
      .then(({ installHiggsfieldDesignInspector }) => {
        installHiggsfieldDesignInspector();
      })
      .catch((error) => {
        reportHiggsfieldError(
          error instanceof Error ? error : new Error("Failed to load design inspector"),
          {
            boundary: "higgsfield_design_inspector_import",
          },
        );
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
