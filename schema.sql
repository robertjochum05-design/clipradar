-- Jedes Video wird als JSON gespeichert. So können später neue Felder dazukommen,
-- ohne dass die Datenbank umgebaut werden muss.
CREATE TABLE IF NOT EXISTS videos (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  data       TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
