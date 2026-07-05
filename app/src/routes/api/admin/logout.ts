import { createFileRoute } from "@tanstack/react-router";

import { buildClearSessionCookie } from "../../../lib/auth.server";

export const Route = createFileRoute("/api/admin/logout")({
  server: {
    handlers: {
      POST: async () => {
        return Response.json(
          { ok: true },
          { status: 200, headers: { "Set-Cookie": buildClearSessionCookie() } },
        );
      },
    },
  },
});
