import { DB_NAME, logger, querySingle, runSqlFile } from './db.js';

async function main() {
  logger.info(`Connecting to database "${DB_NAME}"...`);

  const result = await runSqlFile('../database/02-seed-haciendas.sql');
  logger.info(`Seed applied (affected: ${result.affectedRows}).`);

  const { total } = await querySingle('SELECT COUNT(*) AS total FROM `haciendas`');
  logger.info(`Total rows in "haciendas": ${total}.`);
  logger.info('Database seeding completed successfully.');
}

try {
  await main();
} catch (error) {
  logger.error(`Database seeding failed: ${error.message}`);
  process.exitCode = 1;
}
