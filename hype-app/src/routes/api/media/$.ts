import { createFileRoute } from "@tanstack/react-router";

import { bindings } from "../../../lib/bindings.server";

// Public GET: serves admin-uploaded menu images stored in R2. Splat route —
// the key (e.g. "menu/<uuid>.jpg") is read from the request path directly
// rather than the route's splat param, since it may contain a slash.
export const Route = createFileRoute("/api/media/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const key = decodeURIComponent(url.pathname.replace(/^\/api\/media\//, ""));
        if (!/^menu\/[a-zA-Z0-9-]+\.(jpg|png|webp|gif)$/.test(key)) {
          return new Response("Not found", { status: 404 });
        }

        const { STORAGE } = bindings();
        if (!STORAGE) {
          return new Response("Not found", { status: 404 });
        }

        const object = await STORAGE.get(key);
        if (!object) {
          return new Response("Not found", { status: 404 });
        }

        // Buffered (not streamed): R2's ReadableStream type and the
        // Response constructor's expected DOM ReadableStream type don't
        // line up under @cloudflare/workers-types, and uploads are capped
        // at 5MB anyway so buffering is cheap.
        const bytes = await object.arrayBuffer();
        return new Response(bytes, {
          headers: {
            "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
