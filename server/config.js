import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseWebhookUrl = (value) => {
  const url = (value ?? '').trim();
  if (!url) return '';
  try {
    if (new URL(url).protocol !== 'https:') throw new Error('not https');
  } catch {
    throw new Error('PIPEDREAM_WEBHOOK_URL must be a valid https:// URL.');
  }
  return url;
};

const env = process.env.NODE_ENV ?? 'development';

export const config = Object.freeze({
  env,
  isProduction: env === 'production',
  port: toInt(process.env.PORT, 3000),

  /** Where registration submissions are delivered. Empty = not configured. */
  webhookUrl: parseWebhookUrl(process.env.PIPEDREAM_WEBHOOK_URL),
  webhookTimeoutMs: 10_000,

  /** 0 = off, 1 = trust the first proxy hop (Render, Railway, Nginx, ...). */
  trustProxy: toInt(process.env.TRUST_PROXY, 0),

  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: toInt(process.env.RATE_LIMIT_MAX, 10),
  },

  /** Built React app served in production. */
  distDir: path.resolve(__dirname, '../dist'),
});
