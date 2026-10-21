// Server side of the contact form. Dependencies are injected so the logic can be tested without
// Netlify, Turnstile or Resend (see tests/contact-handler.test.ts).
import { validateContact, type ContactData, type ContactResult } from './contact.ts';

export interface ContactDeps {
  /** Verifies a Turnstile token with Cloudflare. */
  verifyTurnstile: (token: string, ip: string) => Promise<boolean>;
  /** Records a submission for this IP and returns false if the limit is exceeded. */
  allowRequest: (ip: string) => Promise<boolean>;
  sendEmail: (data: ContactData) => Promise<void>;
  log?: (message: string, error?: unknown) => void;
}

const THANKS = '/contact/thanks';
const FALLBACK = '/contact/error';

export async function handleContact(
  request: Request,
  ip: string,
  deps: ContactDeps,
): Promise<Response> {
  // The browser script asks for JSON; a plain no-JS form post gets redirects instead.
  const wantsJson = request.headers.get('accept')?.includes('application/json') ?? false;
  const reply = (result: ContactResult, status: number) =>
    wantsJson
      ? Response.json(result, { status })
      : new Response(null, {
          status: 303,
          headers: { location: new URL(result.ok ? THANKS : FALLBACK, request.url).href },
        });

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: { allow: 'POST' } });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply({ ok: false, error: 'server' }, 400);
  }
  const fields = Object.fromEntries(form);

  // Honeypot: bots fill every field. Pretend it worked so they don't adapt.
  if (typeof fields.website === 'string' && fields.website.trim() !== '') {
    return reply({ ok: true }, 200);
  }

  const { data, errors } = validateContact(fields);
  if (Object.keys(errors).length > 0) {
    return reply({ ok: false, error: 'validation', fields: errors }, 422);
  }

  // No token means JS was off (or a bot). Per SCOPE §8 those go to the email fallback page.
  const token =
    typeof fields['cf-turnstile-response'] === 'string' ? fields['cf-turnstile-response'] : '';
  try {
    if (!token || !(await deps.verifyTurnstile(token, ip))) {
      return reply({ ok: false, error: 'verification' }, 403);
    }
    if (!(await deps.allowRequest(ip))) {
      return reply({ ok: false, error: 'rateLimited' }, 429);
    }
    await deps.sendEmail(data);
  } catch (error) {
    deps.log?.('Contact form failed', error);
    return reply({ ok: false, error: 'server' }, 502);
  }

  return reply({ ok: true }, 200);
}
