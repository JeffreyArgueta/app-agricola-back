import cors from 'cors';
import { ALLOWED_ORIGINS } from '../config/environment.js';

const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Permite mismo origen / curl / móvil (sin origin) y la lista blanca de ALLOWED_ORIGINS
    if (!origin || ALLOWED_ORIGINS?.split(',').includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 horas
  credentials: false,
});

export default corsMiddleware;
