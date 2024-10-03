import { Router } from 'express';
import { loginUser, signUpUser } from '../controllers/auth.controller';


const router = Router();

// POST /api/auth/login - Log in a user
router.post('/login', loginUser);

// POST /api/auth/signup - Sign up a user
router.post('/signup', signUpUser)
export default router;
