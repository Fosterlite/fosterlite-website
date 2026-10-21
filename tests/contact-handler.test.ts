import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { handleContact, type ContactDeps } from '../src/lib/contact-handler.ts';
import type { ContactData } from '../src/lib/contact.ts';

const valid = {
  name: 'Ada Lovelace',
  company: 'Analytical Engines',
  email: 'ada@example.com',
  message: 'We need a system to replace our spreadsheets.',
  'cf-turnstile-response': 'token',
};

function post(fields: Record<string, string>, json = true) {
  const body = new URLSearchParams(fields);
  return new Request('https://fosterlite.com/api/contact', {
    method: 'POST',
    body,
    headers: json ? { accept: 'application/json' } : {},
  });
}

function deps(overrides: Partial<ContactDeps> = {}) {
  const sent: ContactData[] = [];
  const d: ContactDeps = {
    verifyTurnstile: async () => true,
    allowRequest: async () => true,
    sendEmail: async (data) => void sent.push(data),
    ...overrides,
  };
  return { d, sent };
}

describe('handleContact', () => {
  it('sends a valid submission and returns ok (JS path)', async () => {
    const { d, sent } = deps();
    const res = await handleContact(post(valid), '1.2.3.4', d);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { ok: true });
    assert.equal(sent.length, 1);
    assert.equal(sent[0]?.email, 'ada@example.com');
  });

  it('redirects to the thank-you page without JS', async () => {
    const { d } = deps();
    const res = await handleContact(post(valid, false), '1.2.3.4', d);
    assert.equal(res.status, 303);
    assert.equal(res.headers.get('location'), 'https://fosterlite.com/contact/thanks');
  });

  it('silently accepts but drops honeypot submissions', async () => {
    const { d, sent } = deps();
    const res = await handleContact(post({ ...valid, website: 'spam.example' }), '1.2.3.4', d);
    assert.deepEqual(await res.json(), { ok: true });
    assert.equal(sent.length, 0);
  });

  it('returns field errors for invalid input', async () => {
    const { d, sent } = deps();
    const res = await handleContact(
      post({ ...valid, name: ' ', email: 'not-an-email', message: 'too short' }),
      '1.2.3.4',
      d,
    );
    assert.equal(res.status, 422);
    assert.deepEqual(await res.json(), {
      ok: false,
      error: 'validation',
      fields: { name: 'required', email: 'invalid', message: 'tooShort' },
    });
    assert.equal(sent.length, 0);
  });

  it('sends no-JS posts without a Turnstile token to the email fallback page', async () => {
    const { d, sent } = deps();
    const noToken: Record<string, string> = { ...valid };
    delete noToken['cf-turnstile-response'];
    const res = await handleContact(post(noToken, false), '1.2.3.4', d);
    assert.equal(res.status, 303);
    assert.equal(res.headers.get('location'), 'https://fosterlite.com/contact/error');
    assert.equal(sent.length, 0);
  });

  it('rejects a failed Turnstile check', async () => {
    const { d, sent } = deps({ verifyTurnstile: async () => false });
    const res = await handleContact(post(valid), '1.2.3.4', d);
    assert.equal(res.status, 403);
    assert.deepEqual(await res.json(), { ok: false, error: 'verification' });
    assert.equal(sent.length, 0);
  });

  it('rejects when the rate limit is exceeded', async () => {
    const { d, sent } = deps({ allowRequest: async () => false });
    const res = await handleContact(post(valid), '1.2.3.4', d);
    assert.equal(res.status, 429);
    assert.equal(sent.length, 0);
  });

  it('reports a server error when email delivery fails', async () => {
    const logged: string[] = [];
    const { d } = deps({
      sendEmail: async () => {
        throw new Error('Resend down');
      },
      log: (message) => void logged.push(message),
    });
    const res = await handleContact(post(valid), '1.2.3.4', d);
    assert.equal(res.status, 502);
    assert.deepEqual(await res.json(), { ok: false, error: 'server' });
    assert.equal(logged.length, 1);
  });

  it('collapses newlines in single-line fields', async () => {
    const { d, sent } = deps();
    await handleContact(post({ ...valid, name: 'Ada\r\nBcc: x@example.com' }), '1.2.3.4', d);
    assert.equal(sent[0]?.name, 'Ada Bcc: x@example.com');
  });
});
