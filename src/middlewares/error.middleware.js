import { logger } from '../utils/logger.js';

export const notFound = (req, res) =>
  res.status(404).json({ status: false, message: 'Route not found', path: req.path });

export const errorHandler = (err, req, res, _next) => {
  const status = err.status || 500;
  const message = status === 500 ? 'Internal server error' : err.message;
  if (status === 500) logger.error(err.stack);
  res.status(status).json({ status: false, message, ...(err.code && { code: err.code }) });
};
