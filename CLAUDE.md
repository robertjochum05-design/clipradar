# Clipradar

TikTok-Analytics für einen Account mit Clips deutscher Streamer. Der Nutzer programmiert nicht selbst und spricht Deutsch: Änderungen komplett übernehmen, testen, committen, pushen und deployen, dann in einfachen Worten erklären.

## Aufbau
- `public/index.html` – die ganze App (Vanilla JS, keine Build-Tools). Alle Auswertungen laufen im Browser.
- `public/login.html` – Anmeldeseite
- `functions/` – Cloudflare Pages Functions: `_middleware.js` (Login-Schutz per Cookie), `api/login.js`, `api/logout.js`, `api/videos/` (CRUD)
- `schema.sql` – D1-Tabelle `videos` (id, data als JSON). Neue Felder brauchen keine Migration.
- `clipradar-mockup.html` – altes Mockup mit Beispieldaten, nur als Referenz

## Werkzeuge (nicht im PATH)
- Node/npm/npx: `export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"`
- GitHub CLI: `~/.local/bin/gh` (angemeldet, Git-Credentials eingerichtet)
- Wrangler ist per OAuth angemeldet.

## Ablauf bei Änderungen
1. Lokal testen: `.dev.vars` mit `APP_PASSWORD=<Testwert>` anlegen (ist in .gitignore), `npx wrangler d1 execute clipradar --local --file=schema.sql`, dann `npx wrangler pages dev --port 8788`.
2. Commit + `git push`
3. Deploy: `npx wrangler pages deploy --branch main`
4. Live: https://clipradar.pages.dev (Passwort = Secret `APP_PASSWORD`, kennt nur der Nutzer; ändern über `npx wrangler pages secret put APP_PASSWORD --project-name clipradar` im Terminal des Nutzers, danach neu deployen)

## Wichtig
- Die Live-Datenbank enthält echte Daten des Nutzers. Nie remote löschen oder Schema-Änderungen ohne Rückfrage.
- Flop = unter 9.000 Views nach 24 h (in der App einstellbar).
- Gewichtung: gespeichert als Stufe 0/2/3 pro Tag (1 = normal wird nicht gespeichert), Faktor 0,5 (nicht wichtig), 1,25 (wichtig), 1,75 (Hauptgrund), siehe `FACTOR` und `lvl()`. Achtung: Stufe 0 ist falsy, nie `|| 1` verwenden.
- Design: ruhig und professionell (Geist/Geist Mono, neutrale Farben). Erklärungen nie als sichtbarer Fließtext, sondern ausführlich im ⓘ-Tooltip (`info('key')` + Eintrag in `TIPS`).
