import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from '../src/config/environment.js';
import { logger } from '../src/utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const IDENTIFIER_PATTERN = /^[A-Za-z0-9_]+$/;

export function assertValidIdentifier(value, label) {
  if (!IDENTIFIER_PATTERN.test(value)) {
    throw new Error(`Invalid ${label}: "${value}". Use only letters, numbers and underscores.`);
  }
}

export function baseConfig(database) {
  const config = { host: DB_HOST, port: DB_PORT, user: DB_USER, password: DB_PASSWORD };
  if (database) config.database = database;
  return config;
}

export async function ensureDatabase() {
  assertValidIdentifier(DB_NAME, 'DB_NAME');
  const connection = await mysql.createConnection(baseConfig());
  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
    logger.info(`Database "${DB_NAME}" is ready.`);
  } finally {
    await connection.end();
  }
}

export async function runSqlFile(relativePath, { database = DB_NAME } = {}) {
  const fullPath = path.resolve(__dirname, relativePath);
  const sql = await readFile(fullPath, 'utf8');
  logger.info(`Applying ${fullPath}...`);

  const connection = await mysql.createConnection(baseConfig(database));
  try {
    const [result] = await connection.query(sql);
    return result;
  } finally {
    await connection.end();
  }
}

export async function querySingle(sql, { database = DB_NAME } = {}) {
  const connection = await mysql.createConnection(baseConfig(database));
  try {
    const [rows] = await connection.query(sql);
    return rows[0];
  } finally {
    await connection.end();
  }
}

export { DB_HOST, DB_NAME, DB_PORT, DB_USER, logger };
