import express from 'express';
import AddFinancialData from '../Controllers/addFinancialData.js';
import authenticateUser from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/financial-data', authenticateUser, AddFinancialData);

export default router;
