// Contact form rules shared by the browser script and the Netlify Function, so both validate identically.
// Errors are codes, not text; the UI maps them to strings in src/i18n.

export const LIMITS = {
  name: 100,
  company: 100,
  email: 254,
  messageMin: 20,
  messageMax: 5000,
} as const;

export type Field = 'name' | 'company' | 'email' | 'message';
export type FieldError = 'required' | 'invalid' | 'tooShort' | 'tooLong';
export type FieldErrors = Partial<Record<Field, FieldError>>;

export interface ContactData {
  name: string;
  company: string;
  email: string;
  message: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export function validateContact(input: Record<string, unknown>): {
  data: ContactData;
  errors: FieldErrors;
} {
  const data: ContactData = {
    // Collapse whitespace in single-line fields so they're safe to use in an email subject.
    name: text(input.name).replace(/\s+/g, ' '),
    company: text(input.company).replace(/\s+/g, ' '),
    email: text(input.email),
    message: text(input.message),
  };
  const errors: FieldErrors = {};

  if (!data.name) errors.name = 'required';
  else if (data.name.length > LIMITS.name) errors.name = 'tooLong';

  if (data.company.length > LIMITS.company) errors.company = 'tooLong';

  if (!data.email) errors.email = 'required';
  else if (data.email.length > LIMITS.email || !EMAIL.test(data.email)) errors.email = 'invalid';

  if (!data.message) errors.message = 'required';
  else if (data.message.length < LIMITS.messageMin) errors.message = 'tooShort';
  else if (data.message.length > LIMITS.messageMax) errors.message = 'tooLong';

  return { data, errors };
}

/** JSON body returned to the browser script. */
export type ContactResult =
  | { ok: true }
  | { ok: false; error: 'validation'; fields: FieldErrors }
  | { ok: false; error: 'verification' | 'rateLimited' | 'server' };
