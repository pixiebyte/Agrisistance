import express from 'express';
import { register , login } from '../Controllers/authUser.js';
import { validateRequest ,validateRegister , validateLogin } from '../Middleware/validationMiddleware.js';

const router = express.Router();

router.post('/login' ,validateRequest(validateLogin), login);

router.post('/register' ,validateRequest(validateRegister), register);

export default router;