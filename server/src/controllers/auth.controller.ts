import { Request, Response } from 'express';
import { models } from '../db';
import bcrypt from 'bcrypt';
import { generateToken, UserRole } from '../middleware/auth';

// Define interface for login request body
interface LoginRequest {
  email: string;
  password: string;
}

function isValidUserRole(role: string): role is UserRole {
  return ['admin', 'instructor', 'golfer'].includes(role);
}

export const login = async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

  // Validate user_type
  if (!isValidUserRole(user.user_type)) {
    return res.status(500).json({ message: 'Invalid user type' });
  }

  const userData = {
    user_id: user.user_id,
    email: user.email,
    user_type: user.user_type as UserRole // Now TypeScript knows this is safe
  };

  const token = generateToken(userData);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000
  });

  res.json({
    success: true,
    user: userData,
    token,
    message: 'Login successful'
  });
  } catch (error) {
  console.error('Login error:', error);
  res.status(500).json({ message: 'Internal server error' });
  }
  };
