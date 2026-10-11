-- Jedes Video wird als JSON gespeichert. So können später neue Felder dazukommen,
-- ohne dass die Datenbank umgebaut werden muss.
CREATE TABLE IF NOT EXISTS videos (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  data       TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Einstellungen, die geräteübergreifend gelten (Schlüssel -> JSON-Wert).
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
