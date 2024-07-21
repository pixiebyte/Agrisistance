import express from 'express';
import AddSoilData from '../Controllers/addSoilData.js';
import authenticateUser from '../Middleware/authMiddleware.js';

const router = express.Router();


router.post('/soil-data' ,authenticateUser, AddSoilData);

export default router;