import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { ContactData } from '../src/lib/contact.ts';
import { assessSpam, MIN_FILL_MS } from '../src/lib/spam.ts';

const human: ContactData = {
  name: 'Ada Lovelace',
  company: 'Analytical Engines',
  email: 'ada@example.com',
  message:
    'We run our scheduling on spreadsheets and want a proper system. Could we talk next week?',
};
const typed = 45_000;

// Shape of real spam received through the form (Nov 2026), with the link replaced.
const russianLinkSpam: ContactData = {
  name: 'ohrana tryda moskva_abSr',
  company: 'google',
  email: 'iuoqmgqfeSr@example.com',
  message:
    'Если вы ищете качественное обучение по охране труда в Москве, то вам стоит обратить внимание ' +
    'на учебные центры <a href=https://example.ru>https://example.ru</a> и нашёл несколько вариантов.',
};

describe('assessSpam', () => {
  it('passes an ordinary enquiry', () => {
    assert.deepEqual(assessSpam(human, typed), { verdict: 'ok', reasons: [] });
  });

  it('blocks the HTML link spam received through the form', () => {
    assert.deepEqual(assessSpam(russianLinkSpam, typed), {
      verdict: 'block',
      reasons: ['linkMarkup'],
    });
  });

  it('blocks BBCode links', () => {
    const msg = {
      ...human,
      message: 'Great site! [url=https://example.ru]cheap things[/url] here',
    };
    assert.equal(assessSpam(msg, typed).verdict, 'block');
  });

  it('flags mostly Cyrillic messages without links', () => {
    const msg = {
      ...human,
      message: 'Здравствуйте, предлагаем услуги по продвижению вашего сайта.',
    };
    assert.deepEqual(assessSpam(msg, typed), { verdict: 'flag', reasons: ['cyrillic'] });
  });

  it('does not flag an English message with a Cyrillic name mention', () => {
    const msg = { ...human, message: `${human.message} Ask for Иван at reception.` };
    assert.equal(assessSpam(msg, typed).verdict, 'ok');
  });

  it('flags several links but allows a single one', () => {
    const one = { ...human, message: `${human.message} Our current site is https://example.com` };
    assert.equal(assessSpam(one, typed).verdict, 'ok');
    const two = { ...one, message: `${one.message} and https://example.org` };
    assert.deepEqual(assessSpam(two, typed).reasons, ['manyLinks']);
  });

  it('flags a link in the name or company field', () => {
    assert.deepEqual(assessSpam({ ...human, company: 'www.example.ru' }, typed).reasons, [
      'linkInName',
    ]);
  });

  it('flags common spam phrases but not a normal mention of SEO', () => {
    const pitch = {
      ...human,
      message: 'We offer SEO services and backlinks to rank your website.',
    };
    assert.deepEqual(assessSpam(pitch, typed).reasons, ['spamPhrase']);
    const client = { ...human, message: 'We need a new website that is fast and good for SEO.' };
    assert.equal(assessSpam(client, typed).verdict, 'ok');
  });

  it('flags submissions that were too fast or did not report a fill time', () => {
    assert.deepEqual(assessSpam(human, MIN_FILL_MS - 1).reasons, ['tooFast']);
    assert.deepEqual(assessSpam(human, undefined).reasons, ['tooFast']);
    assert.deepEqual(assessSpam(human, Number.NaN).reasons, ['tooFast']);
    assert.equal(assessSpam(human, MIN_FILL_MS).verdict, 'ok');
  });

  it('gives the same answer when called repeatedly', () => {
    const withLink = { ...human, company: 'https://example.ru' };
    for (let i = 0; i < 3; i++)
      assert.deepEqual(assessSpam(withLink, typed).reasons, ['linkInName']);
  });
});
