import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  FORM_FIELD_NAMES,
  REGISTRATION_TYPES,
  createEmptyFormData,
  validateRegistration,
} from '../shared/registration.js';

const validBrand = {
  registrationType: 'Brand',
  companyName: 'Pixel & Co.',
  yourName: 'Sarah Ali',
  positionRole: 'Marketing Director',
  projectType: 'Event',
  email: 'sarah@pixel.co',
  phone: '+962 7 9000 0000',
};

describe('validateRegistration', () => {
  it('accepts a complete Brand submission and returns every field name', () => {
    const result = validateRegistration(validBrand);
    assert.equal(result.valid, true);
    assert.deepEqual(Object.keys(result.data.fields), FORM_FIELD_NAMES);
    assert.equal(result.data.fields.companyName, 'Pixel & Co.');
    assert.equal(result.data.fields.fullName, ''); // unused fields stay empty
  });

  it('treats the message as optional', () => {
    assert.equal(validateRegistration(validBrand).valid, true);
    assert.equal(validateRegistration({ ...validBrand, message: 'Hello' }).valid, true);
  });

  it('rejects unknown or non-string registration types', () => {
    for (const registrationType of ['Hacker', undefined, 42, {}, '__proto__', 'constructor']) {
      const result = validateRegistration({ ...validBrand, registrationType });
      assert.equal(result.valid, false, String(registrationType));
      assert.ok(result.errors.registrationType);
    }
  });

  it('rejects non-object bodies', () => {
    for (const body of [null, undefined, 'x', 5, []]) {
      assert.equal(validateRegistration(body).valid, false);
    }
  });

  it('reports every missing required field', () => {
    const result = validateRegistration({ registrationType: 'Talent' });
    assert.equal(result.valid, false);
    const required = REGISTRATION_TYPES.Talent.fields.filter((f) => f.required).map((f) => f.name);
    assert.deepEqual(Object.keys(result.errors).sort(), required.sort());
  });

  it('trims whitespace and treats blank strings as missing', () => {
    const trimmed = validateRegistration({ ...validBrand, yourName: '  Sarah  ' });
    assert.equal(trimmed.data.fields.yourName, 'Sarah');
    assert.ok(validateRegistration({ ...validBrand, yourName: '   ' }).errors.yourName);
  });

  it('validates the email format', () => {
    assert.ok(validateRegistration({ ...validBrand, email: 'not-an-email' }).errors.email);
  });

  it('only accepts listed options for select fields', () => {
    const result = validateRegistration({ ...validBrand, projectType: 'Hacking' });
    assert.ok(result.errors.projectType);
    // Agency's project type is free text, not a select
    const agency = validateRegistration({
      ...validBrand,
      registrationType: 'Agency',
      projectType: 'Anything',
    });
    assert.equal(agency.valid, true);
  });

  it('enforces length limits and rejects non-string values', () => {
    assert.ok(validateRegistration({ ...validBrand, yourName: 'x'.repeat(201) }).errors.yourName);
    assert.ok(validateRegistration({ ...validBrand, message: 'x'.repeat(2001) }).errors.message);
    assert.ok(validateRegistration({ ...validBrand, yourName: { $ne: null } }).errors.yourName);
  });

  it('drops fields that are not part of the form', () => {
    const result = validateRegistration({ ...validBrand, isAdmin: true, evil: '<script>' });
    assert.equal(result.valid, true);
    assert.equal('isAdmin' in result.data.fields, false);
    assert.equal('evil' in result.data.fields, false);
  });
});

describe('createEmptyFormData', () => {
  it('returns a fresh object with every field set to an empty string', () => {
    const a = createEmptyFormData();
    const b = createEmptyFormData();
    assert.notEqual(a, b);
    assert.ok(Object.values(a).every((value) => value === ''));
  });
});
