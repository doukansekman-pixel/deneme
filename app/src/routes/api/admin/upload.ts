import { createFileRoute } from "@tanstack/react-router";

import { bindings } from "../../../lib/bindings.server";
import { isAdminRequestAuthenticated } from "../../../lib/auth.server";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const Route = createFileRoute("/api/admin/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!(await isAdminRequestAuthenticated(request))) {
          return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
        }

        const { STORAGE } = bindings();
        if (!STORAGE) {
          return Response.json({ ok: false, error: "storage_unavailable" }, { status: 500 });
        }

        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof File)) {
          return Response.json({ ok: false, error: "missing_file" }, { status: 400 });
        }

        const extension = ALLOWED_TYPES[file.type];
        if (!extension) {
          return Response.json({ ok: false, error: "unsupported_type" }, { status: 400 });
        }

        const bytes = new Uint8Array(await file.arrayBuffer());
        if (bytes.byteLength > MAX_BYTES) {
          return Response.json({ ok: false, error: "file_too_large" }, { status: 413 });
        }

        const key = `menu/${crypto.randomUUID()}.${extension}`;
        await STORAGE.put(key, bytes, { httpMetadata: { contentType: file.type } });

        return Response.json({ ok: true, url: `/api/media/${key}` });
      },
    },
  },
});
