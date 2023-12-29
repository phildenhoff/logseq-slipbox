import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";

export const createDb = (path: string) => {
  const db = new DB(path);

  db.execute(`
  DROP TABLE IF EXISTS "notes";
`);
  db.execute(`
CREATE TABLE "notes" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "content" TEXT,
  "times_read" integer NOT NULL DEFAULT '0',
  "times_processed" integer NOT NULL DEFAULT '0',
  "user_id" TEXT NOT NULL, 
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
`);
};

if (import.meta.main) {
  createDb("slipbox.db");
}
