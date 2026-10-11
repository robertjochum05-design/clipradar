import { readVideo, bad } from './_shared.js';

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare('SELECT id, data FROM videos ORDER BY id').all();
  return Response.json(results.map(r => ({ id: r.id, data: JSON.parse(r.data) })));
}

export async function onRequestPost({ request, env }) {
  const { data, error } = await readVideo(request);
  if (error) return bad(error);
  const row = await env.DB.prepare('INSERT INTO videos (data) VALUES (?) RETURNING id').bind(JSON.stringify(data)).first();
  return Response.json({ id: row.id }, { status: 201 });
}

export async function onRequestDelete({ env }) {
  await env.DB.prepare('DELETE FROM videos').run();
  return new Response(null, { status: 204 });
}
