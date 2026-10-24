import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { NextRequest } from 'next/server.js';
import { createRequire } from 'node:module';
const requireFromTest = createRequire(import.meta.url);
const signup = { email: 'person@example.com', name: 'Test Person', phone: '+44 20 7946 0958' };

// Exercise the real validation and route with external email delivery stubbed.
// No test sends mail or creates a live subscription.
function compile(path) {
  return ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
}
const fields = {};
vm.runInNewContext(compile('src/lib/waitlist-fields.ts'), { exports: fields });
const compiled = compile('src/app/api/contact/route.ts');
function loadRoute(send, env = { RESEND_API_KEY: 'test-only' }) {
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, process: { env }, console: { error() {} }, URL,
    require: (id) => id === 'resend' ? { Resend: class { emails = { send }; } }
      : id === '@/lib/waitlist-fields' ? fields : requireFromTest(id),
  });
  return exports.POST;
}
function request(body, origin = 'https://www.trytwinnie.com', raw = false) {
  return new NextRequest('https://www.trytwinnie.com/api/contact', {
    method: 'POST', headers: { 'content-type': 'application/json', origin },
    body: raw ? body : JSON.stringify(body),
  });
}

test('rejects malformed requests, invalid emails and bots before contacting Resend', async () => {
  const POST = loadRoute(() => assert.fail('Invalid input reached the delivery service'));
  for (const body of [null, [], {}, { ...signup, email: 42 }, { ...signup, email: 'bad' },
    { ...signup, website: 'spam' }, { ...signup, email: 'a'.repeat(255) + '@example.com' }]) {
    assert.equal((await POST(request(body))).status, 400);
  }
  assert.equal((await POST(request('{', undefined, true))).status, 400);
  assert.equal((await POST(request('a'.repeat(4097), undefined, true))).status, 413);
  assert.equal((await POST(request(signup, 'https://unrelated.example'))).status, 403);
});

test('name is required, including whitespace-only and wrong-type values', async () => {
  const POST = loadRoute(() => assert.fail('Invalid name reached the delivery service'));
  for (const name of [undefined, null, 42, '', '   ', 'a'.repeat(101), 'line\nbreak']) {
    const response = await POST(request({ ...signup, name }));
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /name/i);
  }
});

test('phone is required and rejects invalid formatting or digit counts', async () => {
  const POST = loadRoute(() => assert.fail('Invalid phone reached the delivery service'));
  for (const phone of [undefined, null, 442079460958, '', '   ', '123456', '+1234567890123456',
    'call me', '++44 20 7946 0958', '44+20 7946 0958', '+44\n2079460958', '<b>1234567</b>']) {
    const response = await POST(request({ ...signup, phone }));
    assert.equal(response.status, 400, String(phone));
    assert.match((await response.json()).error, /phone/i);
  }
});

test('accepts international and national phone formatting without a US-only rule', async () => {
  const POST = loadRoute(async () => ({ data: { id: 'confirmed' } }));
  for (const phone of ['+44 20 7946 0958', '0044 20 7946 0958', '+33 (0)1 42 68 53 00',
    '+81 3-1234-5678', '(415) 555-0123', '020 7946 0958', '+49\u00a030\u202f12345678', '1234567', '+123456789012345']) {
    assert.equal(fields.phoneError(phone), '', phone);
    assert.equal((await POST(request({ ...signup, phone }))).status, 200, phone);
  }
});

test('complete signup sends name and phone to the existing inbox only after validation', async () => {
  let sent;
  const POST = loadRoute(async (payload, options) => { sent = { payload, options }; return { data: { id: 'confirmed' } }; });
  const result = await POST(request({ ...signup, email: '  PERSON@Example.com  ', name: '  José 王  ', phone: '  +44 20 7946 0958  ' }));
  assert.equal(result.status, 200);
  assert.equal((await result.json()).success, true);
  assert.equal(sent.payload.to, 'martin@trytwinnie.com');
  assert.equal(sent.payload.replyTo, 'person@example.com');
  assert.match(sent.payload.text, /Name: José 王/);
  assert.match(sent.payload.text, /Phone: \+44 20 7946 0958/);
  assert.match(sent.payload.html, /<strong>Phone:<\/strong> \+44 20 7946 0958/);
  assert.match(sent.options.idempotencyKey, /^waitlist\/[a-f0-9]{64}$/);
  assert.ok(!sent.options.idempotencyKey.includes('person@'));
});

test('normalized duplicate emails keep the same protection when name or phone changes', async () => {
  const keys = [];
  const POST = loadRoute(async (_, options) => { keys.push(options.idempotencyKey); return { data: { id: 'same-confirmation' } }; });
  await POST(request({ ...signup, email: ' Person@example.com ' }));
  await POST(request({ ...signup, name: 'Different', phone: '+81 3-1234-5678' }));
  assert.equal(keys.length, 2);
  assert.equal(keys[0], keys[1]);
});

test('accepts the public request host when Next.js exposes an internal URL', async () => {
  const POST = loadRoute(async () => ({ data: { id: 'confirmed' } }));
  const req = new NextRequest('http://localhost:3018/api/contact', {
    method: 'POST', headers: { host: '127.0.0.1:3018', origin: 'http://127.0.0.1:3018' },
    body: JSON.stringify(signup),
  });
  assert.equal((await POST(req)).status, 200);
  assert.equal((await POST(request(signup, 'malformed'))).status, 403);
});

test('escapes the name in email HTML', async () => {
  let html;
  const POST = loadRoute(async (payload) => { html = payload.html; return { data: { id: 'confirmed' } }; });
  await POST(request({ ...signup, name: '<b>Person & Friend</b>' }));
  assert.match(html, /&lt;b&gt;Person &amp; Friend&lt;\/b&gt;/);
  assert.ok(!html.includes('<b>Person'));
});

test('configuration, provider, network and missing confirmation failures never report success', async () => {
  const unconfigured = loadRoute(() => assert.fail('Unconfigured route called Resend'), {});
  assert.equal((await unconfigured(request(signup))).status, 503);
  for (const send of [async () => ({ error: { name: 'validation_error' } }), async () => ({}), async () => { throw new Error('offline'); }]) {
    const result = await loadRoute(send)(request(signup));
    assert.equal(result.status, 502);
    assert.equal((await result.json()).success, undefined);
  }
});

test('duplicate conflicts and concurrent requests have actionable errors', async () => {
  for (const name of ['invalid_idempotent_request', 'concurrent_idempotent_requests']) {
    const result = await loadRoute(async () => ({ error: { name } }))(request(signup));
    assert.equal(result.status, 409);
    const body = await result.json();
    assert.ok(body.error);
    assert.equal(body.success, undefined);
  }
});
