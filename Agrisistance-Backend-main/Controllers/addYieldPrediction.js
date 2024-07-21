import pool from '../DB/connect.js';
import { StatusCodes } from 'http-status-codes';

const AddYieldPrediction = async (req, res) => {
    const { crop_type, predicted_yield } = req.body;
    const user_id = req.user.id;

    try {
        const sql = `INSERT INTO Yield_Predictions (user_id, crop_type, predicted_yield) VALUES (?, ?, ?)`;
        await pool.query(sql, [user_id, crop_type, predicted_yield]);

        res.status(StatusCodes.CREATED).json({ message: 'Yield prediction added successfully' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
};

export default AddYieldPrediction;
