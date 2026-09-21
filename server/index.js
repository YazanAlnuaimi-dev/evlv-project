import { createApp } from './app.js';
import { config } from './config.js';

const app = createApp();

const server = app.listen(config.port, () => {
  console.info(`[server] EVLV listening on http://localhost:${config.port} (${config.env})`);
  if (!config.webhookUrl) {
    const consequence = config.isProduction
      ? 'submissions will be rejected with 503'
      : 'submissions will be simulated';
    console.warn(`[server] PIPEDREAM_WEBHOOK_URL is not set: ${consequence}.`);
  }
});

// Graceful shutdown so hosting platforms can restart us without dropping requests.
const shutdown = (signal) => {
  console.info(`[server] ${signal} received, shutting down...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
