import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (src/config -> ../../.env)
// Must be the only place that reads process.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnvVars = [
  'ALLOWED_ORIGINS',
  'DB_URI',
  'DB_DIALECT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_HOST',
  'DB_NAME',
];

const missingEnvVar = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVar.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVar.join(', ')}`);
}

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = parseInt(process.env.PORT, 10) || 3000;
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
export const DB_URI = process.env.DB_URI;
export const DB_DIALECT = process.env.DB_DIALECT;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = parseInt(process.env.DB_PORT, 10) || 3306;
export const DB_NAME = process.env.DB_NAME;

// Centralized typed config object — single source of truth for env
const config = {
  NODE_ENV,
  PORT,
  ALLOWED_ORIGINS,
  DB_URI,
  DB_DIALECT,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME
};

export default config;
