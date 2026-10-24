import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { NextRequest } from 'next/server.js';
import { createRequire } from 'node:module';
const requireFromTest = createRequire(import.meta.url);

// Exercise the real route with the external email service stubbed. Never sends mail.
const compiled = ts.transpileModule(fs.readFileSync('src/app/api/contact/route.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
function loadRoute(send, env = { RESEND_API_KEY: 'test-only' }) {
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, process: { env }, console: { error() {} }, URL,
    require: (id) => id === 'resend' ? { Resend: class { emails = { send }; } } : requireFromTest(id),
  });
  return exports.POST;
}
function request(body, origin = 'https://www.trytwinnie.com', raw = false) {
  return new NextRequest('https://www.trytwinnie.com/api/contact', {
    method: 'POST', headers: { 'content-type': 'application/json', origin },
    body: raw ? body : JSON.stringify(body),
  });
}

test('rejects invalid inputs and bots before contacting Resend', async () => {
  const POST = loadRoute(() => assert.fail('Invalid input reached the delivery service'));
  for (const body of [null, [], {}, { email: 42 }, { email: 'bad' }, { email: 'a@example.com', name: 2 },
    { email: 'a@example.com', name: 'a'.repeat(101) }, { email: 'a@example.com', name: 'line\nbreak' },
    { email: 'a@example.com', website: 'spam' }, { email: 'a'.repeat(255) + '@example.com' }]) {
    assert.equal((await POST(request(body))).status, 400);
  }
  assert.equal((await POST(request('{', undefined, true))).status, 400);
  assert.equal((await POST(request('a'.repeat(4097), undefined, true))).status, 413);
  assert.equal((await POST(request({ email: 'a@example.com' }, 'https://unrelated.example'))).status, 403);
});

test('email-only signup uses the existing inbox and requires a provider confirmation', async () => {
  let sent;
  const POST = loadRoute(async (payload, options) => { sent = { payload, options }; return { data: { id: 'confirmed' } }; });
  const result = await POST(request({ email: '  PERSON@Example.com  ' }));
  assert.equal(result.status, 200);
  assert.equal((await result.json()).success, true);
  assert.equal(sent.payload.to, 'martin@trytwinnie.com');
  assert.equal(sent.payload.replyTo, 'person@example.com');
  assert.match(sent.payload.text, /Name: \(not provided\)/);
  assert.match(sent.options.idempotencyKey, /^waitlist\/[a-f0-9]{64}$/);
  assert.ok(!sent.options.idempotencyKey.includes('person@'));
});

test('normalized duplicates reuse a key, even when the optional name changes', async () => {
  const keys = [];
  const POST = loadRoute(async (_, options) => { keys.push(options.idempotencyKey); return { data: { id: 'same-confirmation' } }; });
  await POST(request({ email: ' Person@example.com ', name: 'Person' }));
  await POST(request({ email: 'person@example.com', name: 'Different' }));
  assert.equal(keys[0], keys[1]);
});

test('accepts the public request host when Next.js exposes an internal URL', async () => {
  const POST = loadRoute(async () => ({ data: { id: 'confirmed' } }));
  const req = new NextRequest('http://localhost:3018/api/contact', {
    method: 'POST', headers: { host: '127.0.0.1:3018', origin: 'http://127.0.0.1:3018' },
    body: JSON.stringify({ email: 'a@example.com' }),
  });
  assert.equal((await POST(req)).status, 200);
  assert.equal((await POST(request({ email: 'a@example.com' }, 'malformed'))).status, 403);
});

test('escapes the optional name in email HTML', async () => {
  let html;
  const POST = loadRoute(async (payload) => { html = payload.html; return { data: { id: 'confirmed' } }; });
  await POST(request({ email: 'person@example.com', name: '<b>Person & Friend</b>' }));
  assert.match(html, /&lt;b&gt;Person &amp; Friend&lt;\/b&gt;/);
  assert.ok(!html.includes('<b>Person'));
});

test('configuration, provider, network and missing confirmation failures never report success', async () => {
  const unconfigured = loadRoute(() => assert.fail('Unconfigured route called Resend'), {});
  assert.equal((await unconfigured(request({ email: 'a@example.com' }))).status, 503);
  for (const send of [async () => ({ error: { name: 'validation_error' } }), async () => ({}), async () => { throw new Error('offline'); }]) {
    const result = await loadRoute(send)(request({ email: 'a@example.com' }));
    assert.equal(result.status, 502);
    assert.equal((await result.json()).success, undefined);
  }
});

test('duplicate conflicts and concurrent requests have actionable errors', async () => {
  for (const name of ['invalid_idempotent_request', 'concurrent_idempotent_requests']) {
    const result = await loadRoute(async () => ({ error: { name } }))(request({ email: 'a@example.com' }));
    assert.equal(result.status, 409);
    const body = await result.json();
    assert.ok(body.error);
    assert.equal(body.success, undefined);
  }
});
