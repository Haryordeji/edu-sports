import { Sequelize } from 'sequelize';
import dbConfig from './config/db.config';
import { initModels } from './models';

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env as keyof typeof dbConfig];


const sequelize = new Sequelize(dbConfig.development.url, {
  dialect: config.dialect,
  logging: config.logging,
});

const models = initModels(sequelize);

export { sequelize, models };