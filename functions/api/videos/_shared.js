const MAX_BYTES = 20000;

// Prüft, dass ein Video als JSON-Objekt mit den Pflichtfeldern ankommt.
export async function readVideo(request) {
  const text = await request.text();
  if (text.length > MAX_BYTES) return { error: 'Eintrag ist zu groß.' };
  let data;
  try { data = JSON.parse(text); } catch { return { error: 'Ungültiges JSON.' }; }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { error: 'Ungültiges Video.' };
  if (typeof data.views !== 'number' || !Array.isArray(data.streamers) || isNaN(Date.parse(data.date))) {
    return { error: 'Views, Streamer und Uploadzeitpunkt sind Pflicht.' };
  }
  delete data.id;
  return { data };
}

export const bad = msg => Response.json({ error: msg }, { status: 400 });
