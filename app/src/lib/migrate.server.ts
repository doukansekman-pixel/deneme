// Applies migrations/*.sql (in filename order) against the local sqlite db,
// tracking applied files in `_migrations` so a rerun (container restart,
// `bun run db:migrate`) never re-executes a file — that matters here because
// several migrations use ALTER TABLE, which errors the second time it runs.
import fs from "node:fs";
import path from "node:path";
import type { Database as DatabaseType } from "better-sqlite3";

export function runMigrations(db: DatabaseType, migrationsDir: string): void {
  db.exec(
    `CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
  );

  const applied = new Set(
    db.prepare("SELECT name FROM _migrations").all().map((row) => (row as { name: string }).name),
  );

  const files = fs
    .readdirSync(migrationsDir)
    .filter((name) => name.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    const apply = db.transaction(() => {
      db.exec(sql);
      db.prepare("INSERT INTO _migrations (name) VALUES (?)").run(file);
    });
    apply();
    console.log(`[migrate] applied ${file}`);
  }
}
