import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { sequelize } from './db';
import * as authController from './controllers/auth.controller';
import * as userController from './controllers/user.controller';
import * as classController from './controllers/class.controller';
import * as feedbackController from './controllers/feedback.controller';
import * as commentController from './controllers/comment.controller';
import { authenticate } from './middleware/auth';
import { AuthenticatedRequest, AuthRequestWithParams, UserParams, ClassParams, NoteParams, FeedbackParams, FeedbackDelParams, CommentDelParams } from "./types/types"
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
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
app.post('/api/registerInstructor', authenticate, async (req: Request, res: Response) => {
  await userController.registerInstructor(req, res);
});
app.post('/api/register',authenticate, async (req: Request, res: Response) => {
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

app.get('/api/users/instructors',
  authenticate, 
  async (req: Request<UserParams>, res: Response, next: NextFunction) => {
    try {
      await userController.getInstructorsNameList(req, res);
    } catch (error) {
      next(error);
    }
  }
);

app.get('/api/users/feedbackinfo/:userId',
  authenticate, 
  async (req: Request<UserParams>, res: Response, next: NextFunction) => {
    try {
      await userController.getUserFeedbackInfo(req, res);
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

// Feedback routes
app.post('/api/feedback/new', authenticate, async (req: Request, res: Response) => {
  await feedbackController.addFeedback(req, res);
});

// get all feedback for a user
app.get('/api/feedback/:golferId', authenticate,
  async (req: AuthRequestWithParams<FeedbackParams>, res: Response, next: NextFunction) => {
    try {
      await feedbackController.getFeedbackForStudent(req, res);
    } catch (error) {
      next(error);
    }
  }
)

// del feedback
app.delete('/api/feedback/:feedbackId', 
  authenticate,
  async (req: Request<FeedbackDelParams>, res: Response, next: NextFunction) => {
    try {
      await feedbackController.deleteFeedback(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// update feedback
app.put('/api/feedback/:feedbackId', 
  authenticate,
  async (req: AuthRequestWithParams<FeedbackDelParams>, res: Response, next: NextFunction) => {
    try {
      await feedbackController.updateFeedback(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// Comment Routes
app.post('/api/comment/new', authenticate, async (req: Request, res: Response) => {
  await commentController.addComment(req, res);
});

// get comments for a particular feedback
app.get('/api/comment/:feedbackId', authenticate,
  async (req: AuthRequestWithParams<FeedbackDelParams>, res: Response, next: NextFunction) => {
    try {
      await commentController.getCommentsForFeedback(req, res);
    } catch (error) {
      next(error);
    }
  }
)

// delete a comment
app.delete('/api/comment/:commentId', 
  authenticate,
  async (req: Request<CommentDelParams>, res: Response, next: NextFunction) => {
    try {
      await commentController.deleteComment(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// update comment
app.put('/api/comment/:commentId', 
  authenticate,
  async (req: AuthRequestWithParams<CommentDelParams>, res: Response, next: NextFunction) => {
    try {
      await commentController.updateComment(req, res);
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