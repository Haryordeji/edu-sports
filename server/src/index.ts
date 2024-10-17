import express from 'express';
import { sequelize, models } from './db';

const app = express();
const PORT = process.env.PORT || 5001;

// Test database connection and sync models
sequelize.authenticate()
  .then(() => {
    console.log('Database connected.');
    return sequelize.sync({ alter: true }); // Sync models with DB schema
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Define routes here, e.g.,
app.get('/users', async (req, res) => {
  const users = await models.User.findAll();
  res.json(users);
});

// test api
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from Expresso!' });
});