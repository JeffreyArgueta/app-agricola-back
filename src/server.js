import app from './app.js';
import { logger } from './utils/logger.js';
import { PORT, NODE_ENV } from './config/environment.js';
import { connectDB, closeDB } from './config/database.js';

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      logger.info(`Server running in http://localhost:${PORT}`);
      logger.info(`Environment mode: ${NODE_ENV}`);
      logger.info(`Process ID: ${process.pid}`);
    });

    const shutdown = async (signal) => {
      logger.info(`Received ${signal}, shutting down...`);
      server.close(async () => {
        try {
          await closeDB();
          logger.info('Server off');
          process.exit(0);
        } catch (error) {
          logger.error('Error while shutting down:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT')); // Ctrl+C (interrumpir)

    // Seguridad: maneja rechazos no manejados
    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection:', reason);
    });
  } catch (error) {
    logger.error('Error initializing server', error);
    process.exit(1);
  }
};

startServer();
