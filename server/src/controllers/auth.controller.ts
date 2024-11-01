import { Request, Response } from 'express';
import { models } from '../db';
import bcrypt from 'bcrypt';

// Define interface for login request body
interface LoginRequest {
  email: string;
  password: string;
}


export const login = async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  console.log("hitttt")
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

    const userData = {
      user_id: user.user_id,
      email: user.email,
      user_type: user.user_type,
    };

    res.json({
      success: true,
      user: userData,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
