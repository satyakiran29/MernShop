import express from 'express';
import { getUsers, deleteUser, updateUserRole, updateUserStatus } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { superAdmin } from '../middleware/superAdmin.js';

const router = express.Router();

router.get('/', protect, superAdmin, getUsers);
router.delete('/:id', protect, superAdmin, deleteUser);
router.put('/:id/role', protect, superAdmin, updateUserRole);
router.put('/:id/status', protect, superAdmin, updateUserStatus);

export default router;
