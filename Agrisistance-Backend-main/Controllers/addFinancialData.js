import pool from '../DB/connect.js';
import { StatusCodes } from 'http-status-codes';

const AddFinancialData = async (req, res) => {
    const { investment_amount, expected_revenue, current_revenue } = req.body;
    const user_id = req.user.id;

    try {
        const sql = `INSERT INTO Financial_Data (user_id, investment_amount, expected_revenue, current_revenue) VALUES (?, ?, ?, ?)`;
        await pool.query(sql, [user_id, investment_amount, expected_revenue, current_revenue]);

        res.status(StatusCodes.CREATED).json({ message: 'Financial data added successfully' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
};

export default AddFinancialData;
