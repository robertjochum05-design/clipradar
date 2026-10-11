import { COOKIE } from '../_middleware.js';

export function onRequestGet() {
  return new Response(null, {
    status: 303,
    headers: { Location: '/login', 'Set-Cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` },
  });
}
