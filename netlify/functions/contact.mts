import type { Config, Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { handleContact } from '../../src/lib/contact-handler.ts';
import type { ContactData } from '../../src/lib/contact.ts';

const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

function env(name: string): string {
  const value = Netlify.env.get(name);
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const body = new FormData();
  body.append('secret', env('TURNSTILE_SECRET_KEY'));
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const result = (await res.json()) as { success?: boolean };
  return result.success === true;
}

// Per-IP sliding window stored in Netlify Blobs. IPs are hashed so no raw addresses are kept.
async function allowRequest(ip: string): Promise<boolean> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`contact:${ip}`));
  const key = Buffer.from(digest).toString('hex');
  const store = getStore('contact-rate-limit');
  const now = Date.now();
  const recent =
    ((await store.get(key, { type: 'json' })) as number[] | null)?.filter(
      (time) => now - time < RATE_LIMIT.windowMs,
    ) ?? [];
  if (recent.length >= RATE_LIMIT.max) return false;
  await store.setJSON(key, [...recent, now]);
  return true;
}

async function sendEmail({ name, company, email, message }: ContactData): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env('RESEND_API_KEY')}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env('CONTACT_FROM_EMAIL'),
      to: [env('CONTACT_TO_EMAIL')],
      reply_to: email,
      subject: `Website enquiry from ${name}${company ? ` (${company})` : ''}`,
      text: [
        `Name: ${name}`,
        `Company: ${company || 'Not given'}`,
        `Email: ${email}`,
        '',
        message,
        '',
        '—',
        'Sent from the contact form on fosterlite.com. Reply to this email to answer the sender.',
      ].join('\n'),
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}

export default (request: Request, context: Context) =>
  handleContact(request, context.ip, {
    verifyTurnstile,
    allowRequest,
    sendEmail,
    log: (message, error) => console.error(message, error),
  });

export const config: Config = {
  path: '/api/contact',
  method: 'POST',
};
