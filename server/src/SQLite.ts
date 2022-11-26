import sqlite3 from "sqlite3";
const { Database } = sqlite3;

export const db = new Database("database.db");

db.on("error", console.error);
db.on("open", () => console.log("Database open"));

db.serialize(() => {
  // make sure we have the table after startup
  db.exec(
    `CREATE TABLE IF NOT EXISTS "connections" (
      "id"        INTEGER NOT NULL UNIQUE,
      "uuid"      TEXT NOT NULL UNIQUE,
      "room"      TEXT,
      "nick"      TEXT NOT NULL,
      "key"       TEXT NOT NULL UNIQUE,
      "timestamp" INTEGER,
      PRIMARY KEY("id" AUTOINCREMENT)
    );`
  );

  // clear table from any dangling connections
  db.exec(`DELETE FROM "connections"`);
});
