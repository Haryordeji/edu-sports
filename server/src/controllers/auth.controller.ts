import { Request, Response } from 'express';
import { models } from '../db';
import bcrypt from 'bcrypt';
import { generateResetToken, generateToken, UserRole } from '../middleware/auth';
import jwt from 'jsonwebtoken';
import sendEmail from '../middleware/email';


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
    user_type: user.user_type as UserRole, // Now TypeScript knows this is safe
    level: user.level
  };

  const token = generateToken(userData);

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
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

  export const requestPasswordReset = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await models.User.findOne({ where: { email } });
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    const resetToken = generateResetToken(user.email);
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  
    try {
      const emailInfo = await sendEmail(
        user.email,
        'Password Reset - Edusports App',
        `Reset your password: ${resetLink}`
      );
    
      res.json({ message: 'Reset link sent to your email' });
    } catch (error: any) {
      console.error('Error sending reset link: ', error.message);
      res.status(500).json({ error: 'Failed to send reset link. Please try again.' });
    }
  };

  const JWT_SECRET = process.env.JWT_SECRET;

  export const resetPassword = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
  
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET!);
  
      const user = await models.User.findOne({ where: { email: decoded.email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update password
      user.password_hash = await bcrypt.hash(newPassword, 10);
      await user.save();
  
      res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  };
  

