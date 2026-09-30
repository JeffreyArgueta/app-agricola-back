import { Sequelize, DataTypes } from 'sequelize';
import { logger } from '../utils/logger.js';
import { DB_DIALECT, DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, NODE_ENV } from './environment.js';

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT || 'mysql',
  dialectModule: undefined, // uses mysql2 via Dialect
  logging: NODE_ENV === 'production' ? false : (msg) => logger.debug(msg),
  timezone: '-06:00', // explicit per §4; adjust to your locale if needed
  define: {
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_bin',
    timestamps: false,
  },
  dialectOptions: {
    charset: 'utf8mb4',
    supportBigNumbers: true,
    bigNumberStrings: false,
  },
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed', error);
    throw error;
  }
};

export const closeDB = async () => {
  try {
    await sequelize.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection', error);
    throw error;
  }
};

export { DataTypes };
export default sequelize;
