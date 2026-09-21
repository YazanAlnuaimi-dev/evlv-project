import { HttpError } from '../utils/httpError.js';

/** JSON 404 for unknown /api routes. */
export function apiNotFound(_req, res) {
  res.status(404).json({ ok: false, message: 'Not found.' });
}

/** Central error handler: never leaks stack traces or internals to clients. */
export function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ ok: false, message: err.message, errors: err.details });
  }

  // Malformed JSON body (thrown by express.json)
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ ok: false, message: 'Request body must be valid JSON.' });
  }
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ ok: false, message: 'Request body is too large.' });
  }

  console.error('[server] unhandled error:', err);
  return res.status(500).json({ ok: false, message: 'Something went wrong on our side.' });
}
