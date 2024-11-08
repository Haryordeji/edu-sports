import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { sequelize, models } from './db';
import * as authController from './controllers/auth.controller';
import * as userController from './controllers/user.controller';
import * as noteController from './controllers/note.controller';
import * as classController from './controllers/class.controller';

const app: Express = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'Server is running!' });
});

// Auth routes for User

interface UserParams {
  userId: string;
}

app.post('/api/login', (req: Request, res: Response) => {authController.login(req, res)});
app.post('/api/register', (req: Request, res: Response) => {
  userController.register(req, res);
});

app.get('/api/users', (req: Request, res: Response) => {
  userController.getUsers(req, res);
});

app.get('/api/users/:userId', (req: Request<UserParams>, res: Response) => {
  userController.getProfile(req, res);
});

app.put('/api/users/:userId', (req: Request<UserParams>, res: Response) => {
  userController.updateProfile(req, res);
});

app.delete('/api/users/:userId', (req: Request<UserParams>, res: Response) => {
  userController.deleteProfile(req, res);
});

// Note routes
app.post('/api/notes', (req: Request, res: Response) => {
  noteController.createNote(req, res);
});
app.get('/api/notes/:noteId', (req: Request<{ noteId: string }>, res: Response) => {
  noteController.getNoteById(req, res);
});

app.put('/api/notes/:noteId', (req: Request<{ noteId: string }>, res: Response) => {
  noteController.updateNote(req, res);
});

app.delete('/api/notes/:noteId', (req: Request<{ noteId: string }>, res: Response) => {
  noteController.deleteNote(req, res);
});

app.get('/api/notes', (req: Request, res: Response) => {
  noteController.listNotes(req, res);
});



// Class routes

interface ClassParams {
  classId: string;
}

app.post('/api/classes', (req: Request, res: Response) => {
  classController.createClass(req, res);
});

app.get('/api/classes', (req: Request, res: Response) => {
  classController.getClasses(req, res);
});

app.get('/api/classes/:classId', (req: Request<ClassParams>, res: Response) => {
  classController.getClass(req, res);
});

app.put('/api/classes/:classId', (req: Request<ClassParams>, res: Response) => {
  classController.updateClass(req, res);
});

app.delete('/api/classes/:classId', (req: Request<ClassParams>, res: Response) => {
  classController.deleteClass(req, res);
});

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