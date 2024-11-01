import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { sequelize, models } from './db';
import * as authController from './controllers/auth.controller';
import userRoutes from './routes/user.routes'; // Import the user routes


const app: Express = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'Server is running!' });
});

// Auth routes
app.post('/api/login', (req: Request, res: Response) => {authController.login(req, res)});
app.get('/api/register',(req: Request, res: Response) => {authController.register(req, res)});

// User routes
app.use('/api', userRoutes); // Register user routes

// Database connection and server start
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

export default app;