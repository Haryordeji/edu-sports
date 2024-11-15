import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { sequelize } from './db';
import * as authController from './controllers/auth.controller';
import * as userController from './controllers/user.controller';
import * as noteController from './controllers/note.controller';
import * as classController from './controllers/class.controller';
import { authenticate } from './middleware/auth';
import { AuthenticatedRequest, AuthRequestWithParams, UserParams, ClassParams, NoteParams } from "./types/types"
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Test route
app.get('/api/test', (_req: Request, res: Response) => {
  res.json({ message: 'Server is running!' });
});

// Auth routes (public)
app.post('/api/login', async (req: Request, res: Response) => {
  await authController.login(req, res);
});

app.post('/api/register', async (req: Request, res: Response) => {
  await userController.register(req, res);
});

// User routes
app.get('/api/users',
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await userController.getUsers(req, res);
    } catch (error) {
      next(error);
    }
  }
);

app.get('/api/users/:userId',
  authenticate, 
  async (req: Request<UserParams>, res: Response, next: NextFunction) => {
    try {
      await userController.getProfile(req, res);
    } catch (error) {
      next(error);
    }
  }
);

app.put('/api/users/:userId', 
  authenticate,
  async (req: AuthRequestWithParams<UserParams>, res: Response, next: NextFunction) => {
    try {
      if (req.user?.user_type !== 'admin' && req.user?.user_id !== req.params.userId) {
        res.status(403).json({ success: false, message: 'Access denied' });
        return;
      }
      await userController.updateProfile(req, res);
    } catch (error) {
      next(error);
    }
  }
);

app.delete('/api/users/:userId', 
  authenticate,
  async (req: Request<UserParams>, res: Response, next: NextFunction) => {
    try {
      await userController.deleteProfile(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// Note routes
app.post('/api/notes', 
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await noteController.createNote(req, res);
    } catch (error) {
      next(error);
    }
  }
);

app.get('/api/notes/:noteId', 
  authenticate,
  async (req: AuthRequestWithParams<NoteParams>, res: Response, next: NextFunction) => {
    try {
      if (!['instructor', 'golfer'].includes(req.user?.user_type || '')) {
        res.status(403).json({ success: false, message: 'Access denied' });
        return;
      }
      await noteController.getNoteById(req, res);
    } catch (error) {
      next(error);
    }
  }
);

app.put('/api/notes/:noteId', 
  authenticate,
  async (req: Request<NoteParams>, res: Response, next: NextFunction) => {
    try {
      await noteController.updateNote(req, res);
    } catch (error) {
      next(error);
    }
  }
);

app.delete('/api/notes/:noteId', 
  authenticate,
  async (req: Request<NoteParams>, res: Response, next: NextFunction) => {
    try {
      await noteController.deleteNote(req, res);
    } catch (error) {
      next(error);
    }
  }
);

app.get('/api/notes', 
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!['instructor', 'golfer'].includes(req.user?.user_type || '')) {
        res.status(403).json({ success: false, message: 'Access denied' });
        return;
      }
      await noteController.listNotes(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// Get notes for specific golfer
app.get('/api/golfers/:golferId/notes',
  authenticate,
  async (req: AuthRequestWithParams<{golferId: string}>, res: Response, next: NextFunction) => {
    try {
      // if (!['instructor', 'golfer'].includes(req.user?.user_type || '')) {
      //   res.status(403).json({ success: false, message: 'Access denied' });
      //   return;
      // }
      
      // If user is a golfer, they can only access their own notes
      if (req.user?.user_type === 'golfer' && req.user?.user_id !== req.params.golferId) {
        res.status(403).json({ success: false, message: 'Access denied' });
        return;
      }
      
      await noteController.getGolferNotes(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// Class routes
app.get('/api/classes',
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await classController.getClasses(req, res);
    } catch (error) {
      next(error);
    }
  }
);

app.get('/api/classes/:classId',
  authenticate,
  async (req: Request<ClassParams>, res: Response, next: NextFunction) => {
    try {
      await classController.getClass(req, res);
    } catch (error) {
      next(error);
    }
  }
);

app.post('/api/classes', 
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!['admin', 'instructor'].includes(req.user?.user_type || '')) {
        res.status(403).json({ success: false, message: 'Access denied' });
        return;
      }
      await classController.createClass(req, res);
    } catch (error) {
      next(error);
    }
  }
);

app.put('/api/classes/:classId', 
  authenticate,
  async (req: AuthRequestWithParams<ClassParams>, res: Response, next: NextFunction) => {
    try {
      if (!['admin', 'instructor'].includes(req.user?.user_type || '')) {
        res.status(403).json({ success: false, message: 'Access denied' });
        return;
      }
      await classController.updateClass(req, res);
    } catch (error) {
      next(error);
    }
  }
);

app.delete('/api/classes/:classId', 
  authenticate,
  async (req: Request<ClassParams>, res: Response, next: NextFunction) => {
    try {
      await classController.deleteClass(req, res);
    } catch (error) {
      next(error);
    }
  }
);

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