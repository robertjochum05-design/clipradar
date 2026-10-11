# Clipradar

Eigenes TikTok-Studio für Streamer-Clips: Videos 24 h nach dem Upload eintragen, taggen und auswerten, welche Streamer, Hooks, Emotionen usw. am besten laufen.

- `public/` – die Website (index.html = App, login.html = Anmeldung)
- `functions/` – Cloudflare Pages Functions (Login-Schutz und API für die Videos)
- `schema.sql` – Datenbank-Tabelle für Cloudflare D1
- `clipradar-mockup.html` – das ursprüngliche Mockup mit Beispieldaten

Läuft auf Cloudflare Pages + D1 (Gratis-Tarif). Das Passwort liegt als Secret `APP_PASSWORD` bei Cloudflare.
