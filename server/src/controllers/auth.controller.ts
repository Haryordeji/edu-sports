import { Request, Response } from 'express';
import { models } from '../db';
import bcrypt from 'bcrypt';

// Define interface for login request body
interface LoginRequest {
  email: string;
  password: string;
}

// Define interface for register request body
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  user_type: string;
  phone_number: string;
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
      username: user.username,
      email: user.email,
      user_type: user.user_type,
      skill_level: user.skill_level,
      phone_number: user.phone_number
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

export const register = async (req: Request<{}, {}, RegisterRequest>, res: Response) => {
  try {
    const { username, email, password, user_type, phone_number } = req.body;

    if (!username || !email || !password || !user_type) {
      return res.status(400).json({ 
        message: 'Username, email, password, and user type are required' 
      });
    }

    const existingUser = await models.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await models.User.create({
      username,
      email,
      password_hash,
      user_type,
      profile_created_at: new Date(),
      phone_number
    });

    const userData = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      user_type: user.user_type
    };

    res.status(201).json({
      success: true,
      user: userData,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};