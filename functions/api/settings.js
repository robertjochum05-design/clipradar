// Kleine Einstellungen, die auf allen Geräten gleich sein sollen (z. B. entfernte Auswahloptionen).
export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare('SELECT key, value FROM settings').all();
  const out = {};
  for (const r of results) {
    try { out[r.key] = JSON.parse(r.value); } catch { /* kaputten Eintrag überspringen */ }
  }
  return Response.json(out);
}

export async function onRequestPut({ request, env }) {
  let body;
  try { body = await request.json(); } catch { body = null; }
  if (!body || typeof body.key !== 'string' || !/^[a-zA-Z0-9_-]{1,64}$/.test(body.key)) {
    return Response.json({ error: 'Ungültiger Schlüssel.' }, { status: 400 });
  }
  const value = JSON.stringify(body.value ?? null);
  if (value.length > 20000) return Response.json({ error: 'Wert ist zu groß.' }, { status: 400 });
  await env.DB.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
    .bind(body.key, value).run();
  return new Response(null, { status: 204 });
}
