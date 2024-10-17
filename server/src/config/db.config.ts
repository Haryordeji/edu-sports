const dotenv = require('dotenv');
dotenv.config();

const dbName = process.env.DB_NAME || 'default_database_name';
console.log('Database name being used:', dbName);

export default {
  development: {
    url: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`,
    dialect: process.env.DB_DIALECT as any || 'postgres',
    logging: console.log,
  }
};