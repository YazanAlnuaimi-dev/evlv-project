/**
 * Registration form definitions and validation.
 *
 * This module is the single source of truth for the "Join EVLV" forms. It is
 * imported by the React app (to render the fields) and by the Express API (to
 * validate submissions), so both sides always agree on which fields exist,
 * which are required and what values are allowed.
 *
 * It must stay dependency-free and runnable in both the browser and Node.
 */

const TEXT_MAX_LENGTH = 200;
const MESSAGE_MAX_LENGTH = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ------------------------------------------------------------------ */
/* Reusable field definitions                                          */
/* ------------------------------------------------------------------ */

const text = (name, label, placeholder) => ({
  name,
  label,
  control: 'input',
  type: 'text',
  placeholder,
  required: true,
});

const select = (name, label, placeholder, options) => ({
  name,
  label,
  control: 'select',
  placeholder,
  options,
  required: true,
});

const EMAIL_FIELD = {
  name: 'email',
  label: 'Email Address',
  control: 'input',
  type: 'email',
  placeholder: 'name@example.com',
  required: true,
};

const PHONE_FIELD = {
  name: 'phone',
  label: 'Phone Number',
  control: 'input',
  type: 'tel',
  placeholder: '+1 (555) 000-0000',
  required: true,
};

const MESSAGE_FIELD = {
  name: 'message',
  label: 'Message',
  control: 'textarea',
  rows: 3,
  required: false,
  maxLength: MESSAGE_MAX_LENGTH,
};

/* ------------------------------------------------------------------ */
/* One form per registration type                                      */
/* ------------------------------------------------------------------ */

export const REGISTRATION_TYPES = {
  Talent: {
    label: 'Talent',
    article: 'a',
    fields: [
      text('fullName', 'Full Name', 'e.g. Maya Khoury'),
      select('category', 'Category', 'Select category', ['Artist', 'Creator', 'Other']),
      text('instagram', 'Instagram Handle', '@yourhandle'),
      text('basedIn', 'Based In', 'e.g. Dubai, UAE'),
      EMAIL_FIELD,
      PHONE_FIELD,
      MESSAGE_FIELD,
    ],
  },

  Brand: {
    label: 'Brand',
    article: 'a',
    fields: [
      text('companyName', 'Company Name', 'e.g. Pixel & Co.'),
      text('yourName', 'Your Name', 'e.g. Sarah Ali'),
      text('positionRole', 'Position / Role', 'e.g. Marketing Director'),
      select('projectType', 'Project Type', 'Select project type', [
        'Influencer Campaign',
        'Talent Booking',
        'Content Production',
        'Event',
        'Other',
      ]),
      EMAIL_FIELD,
      PHONE_FIELD,
      MESSAGE_FIELD,
    ],
  },

  Agency: {
    label: 'Agency',
    article: 'an',
    fields: [
      text('companyName', 'Agency Name', 'e.g. Creative Force Agency'),
      text('yourName', 'Your Name', 'e.g. Omar Hassan'),
      text('positionRole', 'Position / Role', 'e.g. Talent Manager'),
      text('projectType', 'Project Type', 'e.g. Talent Campaign'),
      EMAIL_FIELD,
      PHONE_FIELD,
      MESSAGE_FIELD,
    ],
  },
};

export const REGISTRATION_TYPE_NAMES = Object.keys(REGISTRATION_TYPES);

/**
 * Every field name across all forms. Submissions always carry all of them
 * (unused ones are empty strings) so the payload shape received by the
 * webhook stays identical no matter which form was filled in.
 */
export const FORM_FIELD_NAMES = [
  'fullName',
  'category',
  'instagram',
  'basedIn',
  'companyName',
  'yourName',
  'positionRole',
  'projectType',
  'email',
  'phone',
  'message',
];

export const createEmptyFormData = () =>
  Object.fromEntries(FORM_FIELD_NAMES.map((name) => [name, '']));

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

/**
 * Validates and sanitises a registration request body.
 *
 * @param {unknown} input - `{ registrationType, ...fields }`
 * @returns {{ valid: true, data: { registrationType: string, fields: Record<string,string> } }
 *          | { valid: false, errors: Record<string,string> }}
 */
export function validateRegistration(input) {
  const body = input && typeof input === 'object' ? input : {};
  const typeName = body.registrationType;

  if (typeof typeName !== 'string' || !Object.hasOwn(REGISTRATION_TYPES, typeName)) {
    return { valid: false, errors: { registrationType: 'Unknown registration type.' } };
  }

  const errors = {};
  const fields = createEmptyFormData();

  for (const field of REGISTRATION_TYPES[typeName].fields) {
    const raw = body[field.name];

    if (raw !== undefined && typeof raw !== 'string') {
      errors[field.name] = 'Invalid value.';
      continue;
    }

    const value = (raw ?? '').trim();

    if (!value) {
      if (field.required) errors[field.name] = 'This field is required.';
      continue;
    }

    const maxLength = field.maxLength ?? TEXT_MAX_LENGTH;
    if (value.length > maxLength) {
      errors[field.name] = `Must be ${maxLength} characters or fewer.`;
      continue;
    }

    if (field.control === 'select' && !field.options.includes(value)) {
      errors[field.name] = 'Please choose one of the listed options.';
      continue;
    }

    if (field.type === 'email' && !EMAIL_PATTERN.test(value)) {
      errors[field.name] = 'Enter a valid email address.';
      continue;
    }

    fields[field.name] = value;
  }

  if (Object.keys(errors).length > 0) return { valid: false, errors };
  return { valid: true, data: { registrationType: typeName, fields } };
}
