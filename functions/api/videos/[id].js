import { readVideo, bad } from './_shared.js';

const idOf = params => {
  const id = Number(params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
};

export async function onRequestPut({ request, env, params }) {
  const id = idOf(params);
  if (!id) return bad('Ungültige ID.');
  const { data, error } = await readVideo(request);
  if (error) return bad(error);
  const res = await env.DB.prepare("UPDATE videos SET data = ?, updated_at = datetime('now') WHERE id = ?")
    .bind(JSON.stringify(data), id).run();
  if (!res.meta.changes) return Response.json({ error: 'Video nicht gefunden.' }, { status: 404 });
  return new Response(null, { status: 204 });
}

export async function onRequestDelete({ env, params }) {
  const id = idOf(params);
  if (!id) return bad('Ungültige ID.');
  await env.DB.prepare('DELETE FROM videos WHERE id = ?').bind(id).run();
  return new Response(null, { status: 204 });
}
