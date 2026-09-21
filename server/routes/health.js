import { Router } from 'express';

const router = Router();

/** Liveness probe for uptime monitors and hosting platforms. */
router.get('/', (_req, res) => {
  res.json({ ok: true, uptime: Math.round(process.uptime()) });
});

export default router;
