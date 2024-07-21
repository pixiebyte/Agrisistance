import express from 'express';
import AddWeatherData from '../Controllers/getWeather.js';
import authenticateUser from '../Middleware/authMiddleware.js';

const router = express.Router();

// Route to add weather data
router.get('/weather-data', authenticateUser, AddWeatherData);

export default router;
