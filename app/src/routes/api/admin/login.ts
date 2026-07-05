import { createFileRoute } from "@tanstack/react-router";

import { buildSessionCookie, createSessionToken, verifyAdminPassword } from "../../../lib/auth.server";

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let password: unknown;
        try {
          const body = await request.json();
          password = (body as { password?: unknown } | null)?.password;
        } catch {
          return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
        }

        if (typeof password !== "string" || password.length < 1 || password.length > 200) {
          return Response.json({ ok: false, error: "invalid_password" }, { status: 400 });
        }

        const valid = await verifyAdminPassword(password);
        if (!valid) {
          return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
        }

        const token = await createSessionToken();
        if (!token) {
          return Response.json({ ok: false, error: "server_misconfigured" }, { status: 500 });
        }

        return Response.json(
          { ok: true },
          { status: 200, headers: { "Set-Cookie": buildSessionCookie(token) } },
        );
      },
    },
  },
});
