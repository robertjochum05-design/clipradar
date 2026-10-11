const MAX_BYTES = 20000;
const MAX_BATCH_BYTES = 3000000;

function check(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return 'Ungültiges Video.';
  if (typeof data.views !== 'number' || !Array.isArray(data.streamers) || isNaN(Date.parse(data.date))) {
    return 'Views, Streamer und Uploadzeitpunkt sind Pflicht.';
  }
  delete data.id;
  return null;
}

// Prüft, dass ein Video als JSON-Objekt mit den Pflichtfeldern ankommt.
export async function readVideo(request) {
  const text = await request.text();
  if (text.length > MAX_BYTES) return { error: 'Eintrag ist zu groß.' };
  let data;
  try { data = JSON.parse(text); } catch { return { error: 'Ungültiges JSON.' }; }
  const error = check(data);
  return error ? { error } : { data };
}

// Wie readVideo, akzeptiert aber auch eine Liste (z. B. beim Rückgängigmachen).
export async function readVideos(request) {
  const text = await request.text();
  if (text.length > MAX_BATCH_BYTES) return { error: 'Zu viele Daten auf einmal.' };
  let data;
  try { data = JSON.parse(text); } catch { return { error: 'Ungültiges JSON.' }; }
  const list = Array.isArray(data) ? data : [data];
  if (!list.length || list.length > 2000) return { error: 'Ungültige Anzahl.' };
  for (const item of list) {
    if (JSON.stringify(item).length > MAX_BYTES) return { error: 'Eintrag ist zu groß.' };
    const error = check(item);
    if (error) return { error };
  }
  return { list, many: Array.isArray(data) };
}

export const bad = msg => Response.json({ error: msg }, { status: 400 });
