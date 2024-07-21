import express from 'express';
import UpdateSubscription from '../Controllers/updateSubscription.js';
import authenticateUser from '../Middleware/authMiddleware.js';

const router = express.Router();

router.put('/update-subscription', authenticateUser, UpdateSubscription);

export default router;
