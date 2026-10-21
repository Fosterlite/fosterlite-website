import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { LIMITS, validateContact } from '../src/lib/contact.ts';

const base = { name: 'Ada', email: 'ada@example.com', message: 'x'.repeat(LIMITS.messageMin) };

describe('validateContact', () => {
  it('accepts a minimal valid submission without a company', () => {
    assert.deepEqual(validateContact(base).errors, {});
  });

  it('trims fields and treats whitespace-only values as missing', () => {
    const { data, errors } = validateContact({ ...base, name: '   ', email: ' ada@example.com ' });
    assert.equal(errors.name, 'required');
    assert.equal(data.email, 'ada@example.com');
  });

  it('rejects malformed email addresses', () => {
    for (const email of ['ada', 'ada@', 'ada@example', 'a da@example.com']) {
      assert.equal(validateContact({ ...base, email }).errors.email, 'invalid', email);
    }
  });

  it('enforces message length limits', () => {
    assert.equal(validateContact({ ...base, message: 'short' }).errors.message, 'tooShort');
    const long = 'x'.repeat(LIMITS.messageMax + 1);
    assert.equal(validateContact({ ...base, message: long }).errors.message, 'tooLong');
  });

  it('enforces name and company length limits', () => {
    const long = 'x'.repeat(LIMITS.name + 1);
    const { errors } = validateContact({ ...base, name: long, company: long });
    assert.equal(errors.name, 'tooLong');
    assert.equal(errors.company, 'tooLong');
  });

  it('ignores non-string values', () => {
    assert.equal(validateContact({ ...base, name: 42 }).errors.name, 'required');
  });
});
