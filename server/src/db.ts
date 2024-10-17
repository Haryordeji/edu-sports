import { Sequelize } from 'sequelize';
import dbConfig from '../src/config/db.config';
import { initModels } from './models';

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect as any,
  pool: dbConfig.pool,
  logging: false,
});

const models = initModels(sequelize);

export { sequelize, models };