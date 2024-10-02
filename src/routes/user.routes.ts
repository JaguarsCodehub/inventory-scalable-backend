import { Router } from 'express';
import { getAllUsers } from '../controllers/user.controller';

const router = Router();

// GET /api/users - Get all users
router.get('/', getAllUsers);

export default router;
