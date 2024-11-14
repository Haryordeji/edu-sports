/*  This file contains all the authentication and authorization logic
*/
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ParamsDictionary } from 'express-serve-static-core';

export interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    user_type: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export const generateToken = (payload: {
  user_id: string;
  email: string;
  user_type: string;
}) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ 
        success: false,
        message: 'Invalid token format' 
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        user_id: string;
        email: string;
        user_type: string;
      };
      
      (req as AuthenticatedRequest).user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Authentication failed' 
    });
  }
};

export const optionalAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      next();
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      next();
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        user_id: string;
        email: string;
        user_type: string;
      };
      (req as AuthenticatedRequest).user = decoded;
    } catch (error) {
    }
    next();
  } catch (error) {
    next();
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
      return;
    }

    if (!allowedRoles.includes(authReq.user.user_type)) {
      res.status(403).json({ 
        success: false,
        message: 'Access denied' 
      });
      return;
    }

    next();
  };
};