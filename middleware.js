import { next } from '@vercel/functions';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

const cookieName = '__Host-faria-session';
const sessionSeconds = 8 * 60 * 60;

function equal(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function signature(value, secret) {
  return createHmac('sha256', secret).update(value).digest('hex');
}

function loginPage(invalid = false) {
  return new Response(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Faria · Sign In</title>
<style>
:root{color-scheme:dark;--canvas:#0b1220;--surface:#142031;--ink:#f5f6f7;--muted:#b8c5d5;--line:#52647b;--accent:#f5cd87}
*{box-sizing:border-box}body{margin:0;min-height:100svh;display:grid;place-items:center;background:var(--canvas);color:var(--ink);font:18px system-ui,sans-serif;padding:24px}
main{width:min(100%,380px)}h1{font-size:36px;margin:0 0 12px}p{color:var(--muted);line-height:1.5;margin:0 0 28px}
label{display:block;margin-bottom:10px;font-weight:600}input,button{font:inherit;width:100%;min-height:52px;border-radius:6px}
input{background:var(--surface);border:1px solid var(--line);color:var(--ink);padding:12px}
button{margin-top:16px;background:var(--accent);color:var(--canvas);border:0;font-weight:700;cursor:pointer}
:focus-visible{outline:3px solid var(--accent);outline-offset:4px}.error{color:var(--accent);margin:16px 0 0}
</style></head><body><main><h1>Faria</h1><p>Enter your password to open the personal learning log.</p>
<form method="post"><label for="password">Password</label>
<input id="password" name="password" type="password" autocomplete="current-password" required autofocus maxlength="256">
${invalid ? '<p class="error" role="alert">That password did not match. Try again.</p>' : ''}
<button type="submit">Sign In</button></form></main></body></html>`, {
    status: 401,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export default async function middleware(request) {
  const url = new URL(request.url);

  // Longitude is the separately published public presentation.
  if (url.hostname === 'longitude.jbf.com') return next();

  const presentationPrefix = '/claude1/v3';
  if (url.pathname === presentationPrefix || url.pathname.startsWith(presentationPrefix + '/')) {
    const suffix = url.pathname.slice(presentationPrefix.length);
    return new Response(null, {
      status: 307,
      headers: {
        Location: 'https://longitude.jbf.com' + (suffix || '/') + url.search,
        'Cache-Control': 'no-store',
      },
    });
  }

  const passwordHash = process.env.FARIA_PASSWORD_SHA256;
  const secret = process.env.FARIA_SESSION_SECRET;
  if (!/^[a-f0-9]{64}$/.test(passwordHash || '') || !secret || secret.length < 32) {
    return new Response('Access is temporarily unavailable.', {
      status: 503, headers: { 'Cache-Control': 'no-store' },
    });
  }

  const cookie = (request.headers.get('cookie') || '')
    .split(';').map(value => value.trim())
    .find(value => value.startsWith(cookieName + '='));
  const token = cookie?.slice(cookieName.length + 1) || '';
  const [expires, mac] = token.split('.');
  const now = Math.floor(Date.now() / 1000);
  if (/^\d+$/.test(expires || '') && Number(expires) > now &&
      Number(expires) <= now + sessionSeconds && /^[a-f0-9]{64}$/.test(mac || '') &&
      equal(mac, signature(expires, secret))) {
    return next({ headers: { 'Cache-Control': 'private, no-store' } });
  }

  if (request.method === 'POST') {
    if (request.headers.get('origin') !== url.origin) {
      return new Response('Request refused.', { status: 403, headers: { 'Cache-Control': 'no-store' } });
    }
    if (Number(request.headers.get('content-length') || 0) > 4096) return loginPage(true);
    let password;
    try {
      const body = await request.text();
      if (body.length > 4096) return loginPage(true);
      password = new URLSearchParams(body).get('password') || '';
    } catch {
      return loginPage(true);
    }
    const digest = createHash('sha256').update(password).digest('hex');
    if (equal(digest, passwordHash)) {
      const expiration = String(now + sessionSeconds);
      return new Response(null, {
        status: 303,
        headers: {
          Location: url.pathname + url.search,
          'Set-Cookie': `${cookieName}=${expiration}.${signature(expiration, secret)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${sessionSeconds}`,
          'Cache-Control': 'private, no-store',
        },
      });
    }
    return loginPage(true);
  }

  return loginPage();
}
