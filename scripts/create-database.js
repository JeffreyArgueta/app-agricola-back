import { DB_HOST, DB_PORT, DB_USER, ensureDatabase, logger, runSqlFile } from './db.js';

async function main() {
  logger.info(`Connecting to MySQL ${DB_HOST}:${DB_PORT} as ${DB_USER}...`);
  await ensureDatabase();
  await runSqlFile('../database/01-create-database.sql');
  logger.info('Table "haciendas" is ready.');
  logger.info('Database initialization completed successfully.');
}

try {
  await main();
} catch (error) {
  logger.error(`Database initialization failed: ${error.message}`);
  process.exitCode = 1;
}
