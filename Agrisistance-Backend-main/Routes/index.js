import express from 'express';

import authUsereRoute from './authUserRoute.js';
import addtSoilData from '../Routes/addSoilDataRoute.js';
import UpdateSubscription from '../Routes/updateSubscriptionRoute.js';
import UploadPFP from '../Routes/uploadPFPRoute.js';
import AddPestData from '../Routes/addPestDataRoute.js';
import addYiledPrediction from './addYieldPredictionRoute.js';
import addFinancialData from './addFinancialDataRoute.js';
import getWeatherData from '../Routes/getWeatherRoute.js';
import predict from './predictRoute.js';
const router = express.Router();



router.use('/user', authUsereRoute);
router.use('/soil', addtSoilData);
router.use('/user', UpdateSubscription);
router.use('/user', UploadPFP);
router.use('/pest', AddPestData);   
router.use('/yield', addYiledPrediction);
router.use('/financial', addFinancialData);
router.use('/weather', getWeatherData);
router.use('/model', predict);

export default router;
