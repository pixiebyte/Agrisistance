import express from 'express';
import AddPestData from '../Controllers/addPestData.js';
import authenticateUser from '../Middleware/authMiddleware.js';

const router = express.Router();


router.post('/pest-data', authenticateUser, AddPestData);

export default router;