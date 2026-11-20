// Content checks for contact form submissions that have already passed Turnstile.
// Turnstile stops bots; these catch spam sent by people or paid challenge solvers.
// Only near-certain signals block. Everything else is delivered with a "[Possible spam]" subject
// so a real enquiry is never lost to a false positive.
import type { ContactData } from './contact.ts';

export type SpamReason =
  'linkMarkup' | 'cyrillic' | 'manyLinks' | 'linkInName' | 'spamPhrase' | 'tooFast';

export interface SpamAssessment {
  verdict: 'ok' | 'flag' | 'block';
  reasons: SpamReason[];
}

/** Below this, a person can't have filled in the form. */
export const MIN_FILL_MS = 3000;

// HTML or BBCode links. Nobody types these into a contact form; link-spam tools do.
const LINK_MARKUP = /<a\s[^>]*href|\[url[=\]]|\[link[=\]]/i;
const URLS = /\bhttps?:\/\/\S+|\bwww\.\S+/gi;
const HAS_URL = /\bhttps?:\/\/\S+|\bwww\.\S+/i;
const SPAM_PHRASES =
  /\b(seo services?|backlinks?|link building|guest posts?|first page of google|rank your (web)?site|casino|crypto(currency)?|forex|viagra|cialis|loan offer)\b/i;

function cyrillicShare(text: string): number {
  const letters = text.match(/\p{L}/gu)?.length ?? 0;
  if (letters === 0) return 0;
  return (text.match(/\p{Script=Cyrillic}/gu)?.length ?? 0) / letters;
}

/**
 * @param fillMs Milliseconds between page load and submit, reported by the browser script.
 *   Missing means the post didn't come from our script.
 */
export function assessSpam(data: ContactData, fillMs: number | undefined): SpamAssessment {
  const all = [data.name, data.company, data.email, data.message].join('\n');
  if (LINK_MARKUP.test(all)) return { verdict: 'block', reasons: ['linkMarkup'] };

  const reasons: SpamReason[] = [];
  if (cyrillicShare(`${data.name} ${data.message}`) > 0.3) reasons.push('cyrillic');
  if ((data.message.match(URLS)?.length ?? 0) >= 2) reasons.push('manyLinks');
  if (HAS_URL.test(`${data.name} ${data.company}`)) reasons.push('linkInName');
  if (SPAM_PHRASES.test(`${data.company} ${data.message}`)) reasons.push('spamPhrase');
  if (fillMs === undefined || !Number.isFinite(fillMs) || fillMs < MIN_FILL_MS) {
    reasons.push('tooFast');
  }

  return { verdict: reasons.length ? 'flag' : 'ok', reasons };
}
