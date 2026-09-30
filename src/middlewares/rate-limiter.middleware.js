import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger.js';

/**
 * Limitador general — 15min / 100 req por IP
 */
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true, // Devuelve cabeceras RateLimit-*
  legacyHeaders: false, // Desactiva cabeceras X-RateLimit-*
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP ${req.ip} on ${req.originalUrl}`);
    res.status(429).json({
      status: false,
      message: 'Too many requests, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
    });
  },
});

export default limiter;
