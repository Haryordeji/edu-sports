// src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/types';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables');
}

const JWT_OPTIONS = {
  expiresIn: '24h',
  algorithm: 'HS256'
} as const;

// Define user roles for type safety
export type UserRole = 'admin' | 'instructor' | 'golfer';

interface TokenPayload {
  user_id: string;
  email: string;
  user_type: UserRole;
  iat?: number;
  exp?: number;
}

export const generateToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>) => {
  return jwt.sign(payload, JWT_SECRET, JWT_OPTIONS);
};

// Basic authentication middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
      res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        res.status(401).json({
          success: false,
          message: 'Token has expired'
        });
        return;
      }

      (req as AuthenticatedRequest).user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ 
          success: false,
          message: 'Invalid token'
        });
      } else if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          success: false,
          message: 'Token has expired'
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Authentication failed'
        });
      }
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Role-based authorization middleware
export const authorize = (allowedRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    
    if (!authReq.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Admin override - always allow access
    if (authReq.user.user_type === 'admin') {
      return next();
    }
    
    if (!allowedRoles.includes(authReq.user.user_type as UserRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    next();
  };
};

// Resource ownership verification middleware
export const verifyOwnership = (
  extractUserId: (req: Request) => string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    
    if (!authReq.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const resourceUserId = extractUserId(req);
    
    // Allow admins to bypass ownership check
    if (authReq.user.user_type === 'admin') {
      return next();
    }

    if (authReq.user.user_id !== resourceUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    next();
  };
};