import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { NODE_ENV } from '../config/environment.js';

const customColors = {
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  success: 'green',
  debug: 'magenta',
};

winston.addColors(customColors);

const winstonFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

export const logger = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    success: 3,
    debug: 4,
  },
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  format: winstonFormat,
  transports: [
    // Errores -> logs/error-%DATE%.log con rotación diaria
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d',
      maxSize: '20m',
      zippedArchive: true,
    }),
    // Todos los logs -> logs/combined-%DATE%.log con rotación diaria
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      maxSize: '20m',
      zippedArchive: true,
    }),
  ],
});

if (NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.colorize({ all: true }),
        winston.format.printf(
          ({ level, message, timestamp }) => `${timestamp} [${level}] ${message}`,
        ),
      ),
    }),
  );
}

// Flujo para el registro HTTP de morgan — usar como morgan('combined', { stream: logger.stream })
logger.stream = {
  write: (message) => logger.info(message.trim()),
};

export default logger;
