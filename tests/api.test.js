import assert from 'node:assert/strict';
import http from 'node:http';
import { after, before, describe, it } from 'node:test';

// Configure the environment BEFORE the app (and its frozen config) is imported.
// Empty values also stop dotenv from pulling a developer's local .env into tests.
process.env.NODE_ENV = 'test';
process.env.PIPEDREAM_WEBHOOK_URL = '';
process.env.RATE_LIMIT_MAX = '100';

const { createApp } = await import('../server/app.js');
const { deliverToWebhook } = await import('../server/services/webhook.js');
const { HttpError } = await import('../server/utils/httpError.js');

const validTalent = {
  registrationType: 'Talent',
  fullName: 'Maya Khoury',
  category: 'Creator',
  instagram: '@maya',
  basedIn: 'Amman, JO',
  email: 'maya@example.com',
  phone: '+962 79 000 0000',
};

const listen = (server) =>
  new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));
const close = (server) => new Promise((resolve) => server.close(resolve));

describe('HTTP API', () => {
  let server;
  let base;

  before(async () => {
    server = http.createServer(createApp());
    base = `http://127.0.0.1:${await listen(server)}`;
  });
  after(() => close(server));

  const post = (body, raw = false) =>
    fetch(`${base}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: raw ? body : JSON.stringify(body),
    });

  it('GET /api/health responds ok', async () => {
    const res = await fetch(`${base}/api/health`);
    assert.equal(res.status, 200);
    assert.equal((await res.json()).ok, true);
  });

  it('unknown /api routes return a JSON 404', async () => {
    const res = await fetch(`${base}/api/nope`);
    assert.equal(res.status, 404);
    assert.equal((await res.json()).ok, false);
  });

  it('POST /api/register accepts a valid submission (simulated without a webhook)', async () => {
    const res = await post(validTalent);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { ok: true, simulated: true });
  });

  it('POST /api/register returns 400 with per-field errors', async () => {
    const res = await post({ registrationType: 'Talent', email: 'bad' });
    const body = await res.json();
    assert.equal(res.status, 400);
    assert.ok(body.errors.fullName);
    assert.ok(body.errors.email);
  });

  it('POST /api/register returns 400 for malformed JSON', async () => {
    const res = await post('{not json', true);
    assert.equal(res.status, 400);
  });

  it('sends security headers', async () => {
    const res = await fetch(`${base}/api/health`);
    assert.ok(res.headers.get('content-security-policy')?.includes("default-src 'self'"));
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(res.headers.get('x-powered-by'), null);
  });
});

describe('deliverToWebhook', () => {
  const payload = { registrationType: 'Talent', fullName: 'Maya' };
  let server;
  let url;
  let received;
  let respondWith;

  before(async () => {
    server = http.createServer((req, res) => {
      let data = '';
      req.on('data', (chunk) => (data += chunk));
      req.on('end', () => {
        received = {
          method: req.method,
          type: req.headers['content-type'],
          body: JSON.parse(data),
        };
        res.statusCode = respondWith;
        res.end();
      });
    });
    url = `http://127.0.0.1:${await listen(server)}/`;
  });
  after(() => close(server));

  it('POSTs the payload as JSON', async () => {
    respondWith = 200;
    await deliverToWebhook(payload, { url, timeoutMs: 2000 });
    assert.equal(received.method, 'POST');
    assert.equal(received.type, 'application/json');
    assert.deepEqual(received.body, payload);
  });

  it('throws HttpError(502) when the webhook rejects the request', async () => {
    respondWith = 500;
    await assert.rejects(deliverToWebhook(payload, { url, timeoutMs: 2000 }), (error) => {
      assert.ok(error instanceof HttpError);
      assert.equal(error.status, 502);
      return true;
    });
  });

  it('throws HttpError(502) when the webhook is unreachable', async () => {
    await assert.rejects(
      deliverToWebhook(payload, { url: 'http://127.0.0.1:1/', timeoutMs: 500 }),
      (error) => error instanceof HttpError && error.status === 502,
    );
  });
});
