import { readVideos, bad } from './_shared.js';

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare('SELECT id, data FROM videos ORDER BY id').all();
  return Response.json(results.map(r => ({ id: r.id, data: JSON.parse(r.data) })));
}

export async function onRequestPost({ request, env }) {
  const { list, many, error } = await readVideos(request);
  if (error) return bad(error);
  const stmt = env.DB.prepare('INSERT INTO videos (data) VALUES (?) RETURNING id');
  const res = await env.DB.batch(list.map(d => stmt.bind(JSON.stringify(d))));
  const ids = res.map(r => r.results[0].id);
  return Response.json(many ? { ids } : { id: ids[0] }, { status: 201 });
}

export async function onRequestDelete({ env }) {
  await env.DB.prepare('DELETE FROM videos').run();
  return new Response(null, { status: 204 });
}
