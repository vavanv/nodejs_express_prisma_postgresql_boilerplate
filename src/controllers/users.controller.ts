import { Request, Response } from 'express';

import prisma from '../lib/prisma';
import { UserService } from '../services/user.service';
import { getErrorMessage } from '../utils/error-handler';

const userService = new UserService(prisma);

export async function getAllUsers(_: Request, res: Response) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const { email, name } = req.body;
    const user = await userService.createUser({ email, name });
    res.status(201).json(user);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage === 'User with this email already exists') {
      return res.status(400).json({ error: errorMessage });
    }
    if (errorMessage === 'Invalid email format') {
      return res.status(400).json({ error: errorMessage });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { email, name } = req.body;
    const user = await userService.updateUser(id, { email, name });
    res.json(user);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage === 'User not found') {
      return res.status(404).json({ error: errorMessage });
    }
    if (
      errorMessage === 'Email already in use' ||
      errorMessage === 'Invalid email format'
    ) {
      return res.status(400).json({ error: errorMessage });
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await userService.deleteUser(id);
    res.json({ message: 'User deleted successfully', user });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage === 'User not found') {
      return res.status(404).json({ error: errorMessage });
    }
    if (errorMessage === 'Cannot delete user with existing posts') {
      return res.status(400).json({ error: errorMessage });
    }
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

export async function getUserPosts(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await userService.getUserPosts(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
}
