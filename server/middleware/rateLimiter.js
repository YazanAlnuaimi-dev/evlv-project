import rateLimit from 'express-rate-limit';
import { config } from '../config.js';

/** Throttles the public registration endpoint to blunt spam and abuse. */
export const registrationLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  limit: config.rateLimit.max,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    ok: false,
    message: 'Too many submissions from this network. Please try again in a few minutes.',
  },
});
