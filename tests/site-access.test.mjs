import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import middleware from '../middleware.js';

process.env.FARIA_PASSWORD_SHA256 = createHash('sha256').update('test-password').digest('hex');
process.env.FARIA_SESSION_SECRET = 'test-only-signing-key-with-at-least-32-characters';

test('personal pages and direct assets require a password', async () => {
  for (const path of ['/', '/index.html', '/topics/', '/search.json', '/galileo/model.js']) {
    const result = await middleware(new Request('https://faria.jbf.com' + path));
    assert.equal(result.status, 401);
    assert.equal(result.headers.get('cache-control'), 'private, no-store');
    assert.equal((await result.text()).includes('type="password"'), true);
  }
});

test('exposed deck redirects to the matching public presentation with query preserved', async () => {
  for (const path of ['/claude1/v3', '/claude1/v3/', '/claude1/v3/image.jpg']) {
    const result = await middleware(new Request('https://faria.jbf.com' + path + '?talk=30'));
    assert.equal(result.status, 307);
    assert.equal(result.headers.get('location'), 'https://longitude.jbf.com' + (path.slice(11) || '/') + '?talk=30');
  }
});

test('password validates on server and issues a secure signed session', async () => {
  const submit = value => middleware(new Request('https://faria.jbf.com/', {
    method: 'POST',
    headers: { origin: 'https://faria.jbf.com' },
    body: new URLSearchParams({ password: value }),
  }));
  assert.equal((await submit('incorrect')).status, 401);
  const result = await submit('test-password');
  assert.equal(result.status, 303);
  const cookie = result.headers.get('set-cookie');
  assert.match(cookie, /HttpOnly; Secure; SameSite=Lax/);
  const allowed = await middleware(new Request('https://faria.jbf.com/', { headers: { cookie } }));
  assert.equal(allowed.headers.get('x-middleware-next'), '1');
  const denied = await middleware(new Request('https://faria.jbf.com/', {
    headers: { cookie: cookie.replace(/=[^.]+\./, '=1.') },
  }));
  assert.equal(denied.status, 401);
});

test('cross-origin submissions fail and missing configuration fails closed', async () => {
  assert.equal((await middleware(new Request('https://faria.jbf.com/', {
    method: 'POST', headers: { origin: 'https://elsewhere.example' }, body: 'password=test-password',
  }))).status, 403);
  const secret = process.env.FARIA_SESSION_SECRET;
  delete process.env.FARIA_SESSION_SECRET;
  assert.equal((await middleware(new Request('https://faria.jbf.com/'))).status, 503);
  process.env.FARIA_SESSION_SECRET = secret;
});

test('public longitude presentation continues through', async () => {
  const result = await middleware(new Request('https://longitude.jbf.com/?talk=30'));
  assert.equal(result.headers.get('x-middleware-next'), '1');
});
