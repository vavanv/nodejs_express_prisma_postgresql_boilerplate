import { Router } from 'express';

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserPosts,
} from '../controllers/users.controller';
import { validate } from '../middleware/validate';
import { createUserSchema, updateUserSchema } from '../validators/user.validator';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', validate(createUserSchema), createUser);
router.put('/:id', validate(updateUserSchema), updateUser);
router.delete('/:id', deleteUser);
router.get('/:id/posts', getUserPosts);

export default router;
