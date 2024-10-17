import express from 'express';
import { sequelize, models } from './db';

const app = express();
const PORT = process.env.PORT || 5001;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected.');
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
  res.json({ message: 'Hello from Expreso!' });
});