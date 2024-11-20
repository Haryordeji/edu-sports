require('ts-node/register');
module.exports = require('./db.config.ts').default;

module.exports = {
    development: {
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
    },
    production: {
      use_env_variable: 'DATABASE_URL',
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
            },
        },
    },
  };