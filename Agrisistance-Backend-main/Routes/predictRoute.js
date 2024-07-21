import express from 'express';
import predict from '../Controllers/predict.js';
import authenticateUser from '../Middleware/authMiddleware.js';

const router = express.Router();

// Route to add weather data
router.get('/predict', authenticateUser, predict);

export default router;
