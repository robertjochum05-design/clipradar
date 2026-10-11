// Schützt die ganze Seite: Ohne gültiges Login-Cookie geht es nur zur Login-Seite.
const OPEN = ['/login', '/login.html', '/api/login'];
export const COOKIE = 'cr_session';

export async function sessionToken(password) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(password), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode('clipradar-session-v1'));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function readCookie(request, name) {
  const header = request.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return null;
}

export async function onRequest({ request, env, next }) {
  const { pathname } = new URL(request.url);
  if (OPEN.includes(pathname)) return next();

  if (!env.APP_PASSWORD) {
    return new Response('Clipradar: Es ist noch kein Passwort eingerichtet (Secret APP_PASSWORD fehlt).', { status: 500 });
  }
  const ok = safeEqual(readCookie(request, COOKIE), await sessionToken(env.APP_PASSWORD));
  if (ok) {
    const res = await next();
    const out = new Response(res.body, res);
    out.headers.set('Cache-Control', 'no-store');
    return out;
  }
  if (pathname.startsWith('/api/')) return Response.json({ error: 'Nicht angemeldet' }, { status: 401 });
  return Response.redirect(new URL('/login', request.url).toString(), 302);
}
