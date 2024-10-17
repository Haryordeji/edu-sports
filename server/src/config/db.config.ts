import dotenv from 'dotenv';
dotenv.config();

export default {
  HOST: process.env.DB_HOST || 'localhost',
  USER: process.env.DB_USER || 'postgres',
  PASSWORD: process.env.DB_PASSWORD || '',
  DB: process.env.DB_NAME || 'my_database',
  dialect: process.env.DB_DIALECT as any || 'postgres',
  logging: console.log,
  pool: {
    max: Number(process.env.DB_POOL_MAX) || 5,
    min: Number(process.env.DB_POOL_MIN) || 0,
    acquire: Number(process.env.DB_POOL_ACQUIRE) || 30000,
    idle: Number(process.env.DB_POOL_IDLE) || 10000,
  },
};