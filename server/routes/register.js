import { Router } from 'express';
import { validateRegistration } from '../../shared/registration.js';
import { config } from '../config.js';
import { registrationLimiter } from '../middleware/rateLimiter.js';
import { deliverToWebhook } from '../services/webhook.js';
import { HttpError } from '../utils/httpError.js';

const router = Router();

/**
 * POST /api/register
 * Body: { registrationType: 'Talent' | 'Brand' | 'Agency', ...fields }
 */
router.post('/', registrationLimiter, async (req, res, next) => {
  try {
    const result = validateRegistration(req.body);
    if (!result.valid) {
      throw new HttpError(400, 'Please check your details and try again.', result.errors);
    }

    // Same payload shape the webhook has always received.
    const payload = {
      registrationType: result.data.registrationType,
      ...result.data.fields,
      submittedAt: new Date().toISOString(),
    };

    if (!config.webhookUrl) {
      if (config.isProduction) {
        console.error('[register] PIPEDREAM_WEBHOOK_URL is not set; submission dropped.');
        throw new HttpError(
          503,
          'Registration is temporarily unavailable. Please email us instead.',
        );
      }
      console.info('[register] no webhook configured, simulated submission:', payload);
      return res.json({ ok: true, simulated: true });
    }

    await deliverToWebhook(payload, {
      url: config.webhookUrl,
      timeoutMs: config.webhookTimeoutMs,
    });

    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

export default router;
