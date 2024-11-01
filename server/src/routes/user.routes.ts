import express from 'express';
import { createUser,getUsers, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller';

const router = express.Router();


// Route to create a new user
router.post('/users', createUser);

// Route to get users based on any combination of properties
router.get('/users', getUsers);

// Route to get all users
router.get('/users', getAllUsers);

// Route to get a specific user by ID
router.get('/users/:id', getUserById);

// Route to update a user by ID
router.put('/users/:id', updateUser);

// Route to delete a user by ID
router.delete('/users/:id', deleteUser);

export default router;