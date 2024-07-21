import express from 'express';
import AddYieldPrediction from '../Controllers/addYieldPrediction.js';
import authenticateUser from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/yield-prediction', authenticateUser, AddYieldPrediction);

export default router;
