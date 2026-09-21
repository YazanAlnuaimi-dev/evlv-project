import fs from 'node:fs';
import path from 'node:path';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config.js';
import { errorHandler } from './middleware/errorHandler.js';
import api from './routes/index.js';

export function createApp() {
  const app = express();

  if (config.trustProxy) app.set('trust proxy', config.trustProxy);

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ["'self'"],
          'script-src': ["'self'"],
          'style-src': ["'self'", 'https://fonts.googleapis.com'],
          'font-src': ["'self'", 'https://fonts.gstatic.com'],
          'img-src': ["'self'", 'data:'],
          'connect-src': ["'self'"],
          'object-src': ["'none'"],
          'frame-ancestors': ["'none'"],
          // Safari would try to upgrade http://localhost to https during development.
          'upgrade-insecure-requests': config.isProduction ? [] : null,
        },
      },
    }),
  );
  app.use(compression());
  app.use(morgan(config.isProduction ? 'combined' : 'dev', { skip: () => config.env === 'test' }));

  app.use('/api', api);

  const indexHtml = path.join(config.distDir, 'index.html');

  if (fs.existsSync(indexHtml)) {
    // Hashed build assets can be cached "forever"; index.html must always revalidate.
    app.use(
      '/assets',
      express.static(path.join(config.distDir, 'assets'), { immutable: true, maxAge: '1y' }),
    );
    app.use(express.static(config.distDir, { index: false, maxAge: '1h' }));
    app.use((req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      res.setHeader('Cache-Control', 'no-cache');
      return res.sendFile(indexHtml);
    });
  } else {
    app.get('/', (_req, res) => {
      res
        .status(200)
        .type('text/plain')
        .send(
          'EVLV API is running.\n' +
            'The website has not been built yet. Use "npm run dev" (http://localhost:5173) ' +
            'or run "npm run build" and restart.',
        );
    });
  }

  app.use(errorHandler);
  return app;
}
