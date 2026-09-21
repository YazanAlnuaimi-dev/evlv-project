const REGISTER_ENDPOINT = '/api/register';
const FALLBACK_MESSAGE =
  'We could not send your registration. Check your connection and try again.';

/** Error thrown for any failed API call, safe to show to the user. */
export class ApiError extends Error {
  constructor(message, { status, fieldErrors } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors ?? {};
  }
}

/**
 * Sends a registration to the EVLV API.
 *
 * @param {string} registrationType - 'Talent' | 'Brand' | 'Agency'
 * @param {Record<string, string>} fields - form values keyed by field name
 */
export async function submitRegistration(registrationType, fields) {
  let response;

  try {
    response = await fetch(REGISTER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationType, ...fields }),
    });
  } catch {
    throw new ApiError(FALLBACK_MESSAGE);
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(body?.message ?? FALLBACK_MESSAGE, {
      status: response.status,
      fieldErrors: body?.errors,
    });
  }

  return body;
}
