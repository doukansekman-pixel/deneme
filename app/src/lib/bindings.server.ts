// Server-only access to this app's data/storage backends. Originally these
// were Cloudflare bindings (D1 `DB`, R2 `STORAGE`); the app now runs as a
// plain Node/Docker deployment, so this module is a thin adapter that
// reproduces the same `.prepare(sql).bind(...).first()/.all()/.run()` (D1)
// and `.put()/.get()` (R2) shapes on top of better-sqlite3 + local disk. No
// other file imports better-sqlite3 or touches the filesystem directly —
// callers (public.functions.ts, admin.functions.ts, upload.ts, media/$.ts)
// are unchanged from the Cloudflare version.
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

import { runMigrations } from "./migrate.server";

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), "data", "vype.db");
const UPLOADS_DIR = process.env.UPLOADS_DIR ?? path.join(process.cwd(), "data", "uploads");
const MIGRATIONS_DIR = process.env.MIGRATIONS_DIR ?? path.join(process.cwd(), "migrations");

type Row = Record<string, unknown>;

class LocalD1PreparedStatement {
  constructor(
    private readonly db: Database.Database,
    private readonly sql: string,
    private readonly params: unknown[] = [],
  ) {}

  bind(...params: unknown[]): LocalD1PreparedStatement {
    return new LocalD1PreparedStatement(this.db, this.sql, params);
  }

  async first<T = Row>(): Promise<T | null> {
    const row = this.db.prepare(this.sql).get(...this.params);
    return (row as T | undefined) ?? null;
  }

  async all<T = Row>(): Promise<{ results: T[] }> {
    const rows = this.db.prepare(this.sql).all(...this.params);
    return { results: rows as T[] };
  }

  async run(): Promise<{ success: true }> {
    this.db.prepare(this.sql).run(...this.params);
    return { success: true };
  }
}

class LocalD1Database {
  constructor(private readonly db: Database.Database) {}

  prepare(sql: string): LocalD1PreparedStatement {
    return new LocalD1PreparedStatement(this.db, sql);
  }
}

// Mirrors the R2Bucket surface the routes use: put(key, bytes, {httpMetadata})
// and get(key) -> { httpMetadata, arrayBuffer() }. Keys are validated by the
// callers (upload.ts generates them; media/$.ts regex-checks them) but we
// still refuse to resolve outside `root` as defense in depth.
class LocalDiskBucket {
  constructor(private readonly root: string) {
    fs.mkdirSync(root, { recursive: true });
  }

  private resolve(key: string): string {
    const filePath = path.resolve(this.root, key);
    if (filePath !== this.root && !filePath.startsWith(this.root + path.sep)) {
      throw new Error("invalid_key");
    }
    return filePath;
  }

  async put(
    key: string,
    bytes: Uint8Array,
    opts?: { httpMetadata?: { contentType?: string } },
  ): Promise<void> {
    const filePath = this.resolve(key);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, bytes);
    fs.writeFileSync(
      filePath + ".meta.json",
      JSON.stringify({ contentType: opts?.httpMetadata?.contentType ?? null }),
    );
  }

  async get(
    key: string,
  ): Promise<{ httpMetadata: { contentType?: string }; arrayBuffer(): Promise<ArrayBuffer> } | null> {
    const filePath = this.resolve(key);
    if (!fs.existsSync(filePath)) return null;

    let contentType: string | undefined;
    try {
      const meta = JSON.parse(fs.readFileSync(filePath + ".meta.json", "utf8")) as {
        contentType?: string | null;
      };
      contentType = meta.contentType ?? undefined;
    } catch {
      // No/unreadable sidecar metadata — fall back to no content type.
    }

    return {
      httpMetadata: { contentType },
      async arrayBuffer() {
        const buf = fs.readFileSync(filePath);
        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
      },
    };
  }
}

type AppEnv = {
  DB?: LocalD1Database;
  STORAGE?: LocalDiskBucket;
  HF_ENV?: string;
  APP_SLUG?: string;
  ADMIN_PASSWORD?: string;
  SESSION_SECRET?: string;
};

let sharedDb: Database.Database | undefined;
let sharedBindings: AppEnv | undefined;

function getDb(): Database.Database {
  if (!sharedDb) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    sharedDb = new Database(DB_PATH);
    sharedDb.pragma("journal_mode = WAL");
    sharedDb.pragma("foreign_keys = ON");
    runMigrations(sharedDb, MIGRATIONS_DIR);
  }
  return sharedDb;
}

export function bindings(): AppEnv {
  if (!sharedBindings) {
    sharedBindings = {
      DB: new LocalD1Database(getDb()),
      STORAGE: new LocalDiskBucket(UPLOADS_DIR),
      HF_ENV: process.env.HF_ENV,
      APP_SLUG: process.env.APP_SLUG,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
      SESSION_SECRET: process.env.SESSION_SECRET,
    };
  }
  return sharedBindings;
}
