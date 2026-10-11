import { COOKIE, sessionToken, safeEqual } from '../_middleware.js';

const MAX_AGE = 60 * 60 * 24 * 180; // 180 Tage angemeldet bleiben

export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  const password = String(form.get('password') || '');
  const url = new URL(request.url);

  if (!env.APP_PASSWORD || !safeEqual(password, env.APP_PASSWORD)) {
    await new Promise(r => setTimeout(r, 800)); // bremst Passwort-Raten
    return Response.redirect(new URL('/login?fehler=1', url).toString(), 303);
  }
  const token = await sessionToken(env.APP_PASSWORD);
  return new Response(null, {
    status: 303,
    headers: {
      Location: '/',
      'Set-Cookie': `${COOKIE}=${token}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
    },
  });
}
