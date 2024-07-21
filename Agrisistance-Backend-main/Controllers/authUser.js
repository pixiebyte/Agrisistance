import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import pool from '../DB/connect.js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const register = async (req, res) => {
    try {
        const { firstName, lastName, country, role, phoneNumber, eMail, password } = req.body;

        const [rows] = await pool.query('SELECT 1 FROM Users WHERE eMail = ?', [eMail]);
        if (rows.length > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'E-mail already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user_id = uuidv4();

        const sql = 'INSERT INTO Users (user_id, firstName, lastName, country, role, phoneNumber, eMail, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        await pool.query(sql, [user_id, firstName, lastName, country, role, phoneNumber, eMail, hashedPassword]);

        const token = jwt.sign({ user_id }, process.env.JWT_SECRET, { expiresIn: '12h' });

        res.status(StatusCodes.CREATED).json({         
                token,
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid email' });
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '12h' });

        return res.status(StatusCodes.OK).json({
            token,
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
};

export { register, login };
