import express, { Router } from 'express';
import { apiNotFound } from '../middleware/errorHandler.js';
import health from './health.js';
import register from './register.js';

const api = Router();

api.use(express.json({ limit: '32kb' }));
api.use('/health', health);
api.use('/register', register);
api.use(apiNotFound);

export default api;
