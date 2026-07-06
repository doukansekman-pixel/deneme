// Node runtime entry, replacing the Cloudflare Workers deploy target. This
// project hand-rolls its Worker entry (src/server.ts calls into
// @tanstack/react-start/server-entry, a plain `(Request) => Response`
// handler) rather than going through a Nitro deploy preset, and on Workers
// static assets under dist/client never even reach that handler — Cloudflare's
// own asset layer serves them first (see app/wrangler.jsonc). Reproduce both
// halves here: serve dist/client directly, fall through to the built SSR
// handler (dist/server/server.js) for everything else.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const clientDir = path.join(root, "dist", "client");

const { default: serverEntry } = await import(
  path.join(root, "dist", "server", "server.js")
);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

// Vite-built bundles carry a content hash in the filename (e.g.
// index-Va-izn1j.js); files copied verbatim from public/ (logo.png, …) do
// not. Only the former are safe to cache forever.
const HASHED_FILENAME = /-[A-Za-z0-9_-]{8,}\.[a-z0-9]+$/;

function resolveStaticFile(pathname) {
  if (pathname.includes("..")) return null;
  const filePath = path.join(clientDir, decodeURIComponent(pathname));
  if (filePath !== clientDir && !filePath.startsWith(clientDir + path.sep)) return null;
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return null;
  return filePath;
}

function toFetchRequest(req) {
  const protocol = req.headers["x-forwarded-proto"] ?? "http";
  const host = req.headers["host"] ?? "localhost";
  const url = `${protocol}://${host}${req.url}`;

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) for (const v of value) headers.append(key, v);
    else headers.set(key, value);
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  return new Request(url, {
    method: req.method,
    headers,
    body: hasBody ? Readable.toWeb(req) : undefined,
    duplex: hasBody ? "half" : undefined,
  });
}

function writeFetchResponse(response, res) {
  const headers = {};
  for (const [key, value] of response.headers) headers[key] = value;
  res.writeHead(response.status, headers);
  if (!response.body) {
    res.end();
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    Readable.fromWeb(response.body).pipe(res).on("finish", resolve).on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const staticFile = req.method === "GET" ? resolveStaticFile(url.pathname) : null;

    if (staticFile) {
      const ext = path.extname(staticFile);
      const immutable = url.pathname.startsWith("/assets/") && HASHED_FILENAME.test(staticFile);
      res.writeHead(200, {
        "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream",
        "Cache-Control": immutable
          ? "public, max-age=31536000, immutable"
          : "public, max-age=3600",
      });
      fs.createReadStream(staticFile).pipe(res);
      return;
    }

    const response = await serverEntry.fetch(toFetchRequest(req), undefined, undefined);
    await writeFetchResponse(response, res);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => {
  console.log(`[server] listening on :${port}`);
});
