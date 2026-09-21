import { HttpError } from '../utils/httpError.js';

/**
 * Delivers a registration payload to the configured webhook (Pipedream).
 * Throws an HttpError(502) when the webhook can't be reached or rejects it.
 */
export async function deliverToWebhook(payload, { url, timeoutMs }) {
  let response;

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    console.error('[webhook] request failed:', error.message);
    throw new HttpError(502, 'We could not deliver your registration. Please try again shortly.');
  }

  if (!response.ok) {
    console.error(`[webhook] responded with ${response.status}`);
    throw new HttpError(502, 'We could not deliver your registration. Please try again shortly.');
  }
}
