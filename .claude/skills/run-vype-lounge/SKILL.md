---
name: run-vype-lounge
description: Launch and drive the Vype Lounge app (TanStack Start, Node/Docker deploy) for verification - build, run against local sqlite/disk, curl smoke tests, and a Playwright screenshot flow for UI changes. Applies to the whole vype-lounge repo (app/ is the project root for build/run commands).
---

# Running Vype Lounge

The app runs as a plain Node process (Cloudflare Workers was replaced - see
`app/src/lib/bindings.server.ts` and `app/server/node-entry.mjs`). Two ways
to run it: **quick local** (fastest for iterating on a change) and **full
Docker stack** (matches production exactly). Use quick local for UI/logic
verification; use Docker only when the thing under test is
container/Caddy/volume-specific.

## Quick local run

```bash
cd /root/vype-lounge/app
export PATH="$HOME/.bun/bin:$PATH"   # bun is the package manager (bun.lock, workspace:* deps)
bun run typecheck                     # tsc --noEmit
bun run build                         # vite build -> dist/client + dist/server/server.js

rm -rf /tmp/vype-run && mkdir -p /tmp/vype-run
DB_PATH=/tmp/vype-run/vype.db \
UPLOADS_DIR=/tmp/vype-run/uploads \
MIGRATIONS_DIR=/root/vype-lounge/app/migrations \
PORT=3400 \
ADMIN_PASSWORD=testpass \
SESSION_SECRET=testsecret \
COOKIE_SECURE=false \
  nohup node server/node-entry.mjs > /tmp/vype-run/server.log 2>&1 &

sleep 1.5 && cat /tmp/vype-run/server.log   # confirm "[server] listening" + migrations applied
```

Stop it when done: `pkill -f 'node server/node-entry.mjs'` (if that leaves
the process alive - it has, once, exit code 144 from job-control noise -
find the PID with `ps aux | grep node-entry` and `kill -9` it directly).
Always `rm -rf /tmp/vype-run` after - don't leave scratch DBs/uploads lying
around in `/tmp`.

`COOKIE_SECURE=false` matters: the admin session cookie is `Secure` by
default (see `app/src/lib/auth.server.ts`), so it won't round-trip over
plain `http://localhost` without this.

### curl smoke tests

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3400/            # 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3400/menu        # 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3400/admin/login # 200

COOKIE=$(curl -s -i -X POST http://localhost:3400/api/admin/login \
  -H "Content-Type: application/json" -d '{"password":"testpass"}' \
  | grep -i '^set-cookie' | sed 's/set-cookie: //I' | cut -d';' -f1)

curl -s -X POST http://localhost:3400/api/admin/upload -H "Cookie: $COOKIE" \
  -F "file=@/path/to/some.png;type=image/png"   # {"ok":true,"url":"/api/media/menu/<uuid>.png"}
```

## Visual/UI changes: Playwright screenshots

No `chromium-cli` on this box. Install Playwright + Chromium once per
session (not preinstalled; takes ~1-2 min):

```bash
mkdir -p /tmp/claude-0/-root/*/scratchpad/pw-run && cd $_   # use the actual scratchpad path
npm init -y >/dev/null 2>&1
npm install playwright@1.61.1 --no-save
npx playwright install --with-deps chromium   # pulls in xvfb, fonts, etc via apt
```

Driver script pattern (adjust URL/selectors per task):

```js
import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:3400/", { waitUntil: "networkidle" });
await page.screenshot({ path: "/tmp/vype-shots/01-home.png" });
console.log("CONSOLE_ERRORS:", JSON.stringify(errors));
await browser.close();
```

Gotchas hit so far:
- CSP blocks a Google Fonts `data:` URI at runtime → shows up as a
  `console --errors` / `pageerror` entry on every page load. This is
  pre-existing and unrelated to app changes - don't chase it, just don't
  mistake it for a regression.
- Admin login form: `input[type='password']`, `button[type='submit']`,
  then `page.waitForURL("**/admin")` - **no trailing slash** (the route
  file is `admin/index.tsx` → `/admin/` but the login redirect and
  `server.ts` both normalize to `/admin`; a `**/admin/` pattern times out).
- Always check the homepage/admin page *after* an edit actually reflects
  it (e.g. `page.textContent("body")` includes the new copy) - a save
  button that shows "Kaydedildi" doesn't by itself prove the write landed
  correctly in sqlite.

Clean up after: kill the node process, `rm -rf` the temp DB dir, the
screenshots dir, and the scratchpad Playwright install (it's ~300MB of
Chromium, don't leave it around across unrelated tasks).

## Full Docker stack (production parity)

```bash
cd /root/vype-lounge
docker compose up -d --build app     # rebuild just the app image + recreate that container
docker compose logs app --tail 20    # confirm migrations ran, no errors
curl -s -o /dev/null -w "%{http_code}\n" http://localhost/   # through Caddy on :80
```

Secrets come from `/root/vype-lounge/.env` (`ADMIN_PASSWORD`,
`SESSION_SECRET`, gitignored). Real admin login there uses whatever
`ADMIN_PASSWORD` is currently in that file, not `testpass`.

## Adding a migration

New `migrations/000N_*.sql` files are picked up automatically (tracked in
the `_migrations` table, see `app/src/lib/migrate.server.ts`) - just add
the file with the next number and restart/rebuild. No separate "run
migrations" step needed; it happens on first DB access at process start.
