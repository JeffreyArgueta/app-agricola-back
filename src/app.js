import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { logger } from './utils/logger.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';
import corsMiddleware from './middlewares/cors.middleware.js';
import helmetMiddleware from './middlewares/helmet.middleware.js';
import xssSanitizeMiddleware from './middlewares/xss-sanitize.middleware.js';
import { limiter } from './middlewares/rate-limiter.middleware.js';
import { swaggerSpecV1 } from './config/swagger.js';
import { v1Router } from './routes/v1/index.js';

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(compression());
app.use(corsMiddleware);
app.use(helmetMiddleware);
app.use(xssSanitizeMiddleware);
app.use(morgan('combined', { stream: { write: (m) => logger.info(m.trim()) } }));
app.use(limiter);

// Endpoints de salud (obligatorio antes de /api/v1)
app.get('/', (_req, res) => res.json({ status: true, message: 'API running', version: '1.0.0' }));
app.get('/health', (_req, res) =>
  res.json({
    status: true,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  }),
);

// API v1
app.use('/api/v1', v1Router);

// Documentación Swagger — OpenAPI 3.0
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecV1, { explorer: true }));

app.use(notFound);
app.use(errorHandler);

export default app;
