import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { Op } from 'sequelize';

// Create a new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.create(req.body); // Assuming req.body contains user data
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  };

  // Get users with query parameters
  export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      // Initialize the conditions object
      const conditions: any = {};
  
      // Loop through each property in the query parameters
      Object.keys(req.query).forEach((key) => {
        const value = req.query[key];
  
        if (value) {
          // If the value is a comma-separated string, use Op.in for multiple values
          if (typeof value === 'string' && value.includes(',')) {
            conditions[key] = { [Op.in]: value.split(',').map(v => v.trim()) };
          }
          // Use partial matching for specific string properties
          else if (key === 'username' || key === 'email' || key === 'emergency_contact_name' || key === 'availability') {
            conditions[key] = { [Op.like]: `%${value}%` };
          }
          // For other properties, use exact matching
          else {
            conditions[key] = value;
          }
        }
      });
  
      // Fetch all users if no conditions are set, otherwise apply conditions
      const users = Object.keys(conditions).length > 0
        ? await User.findAll({ where: conditions })
        : await User.findAll();
  
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving users', error });
    }
  };

// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

// Update a user by ID
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
  
    try {
      const user = await User.findByPk(id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      await user.update(req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error });
    }
  };

// Delete a user by ID
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};
