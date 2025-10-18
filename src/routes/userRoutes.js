import express from 'express';
import { getUsers, uploadAvatar, updateUser } from '../controllers/userController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/avatar', verifyToken, uploadAvatar);
router.put('/:id', verifyToken, updateUser); // ✅ ini penting

export default router;