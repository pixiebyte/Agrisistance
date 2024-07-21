import { StatusCodes } from 'http-status-codes';
import pool from '../DB/connect.js';


const addSoilData = async (req, res) => {

    const { latitude, longitude, land_size, ph_level, nitrogen, phosphorus, potassium, porosity, oxygen_level } = req.body;
    const user_id = req.user.id;

    const sql = `INSERT INTO Soil_Data (latitude, longitude, land_size, ph_level, nitrogen, phosphorus, potassium, porosity, oxygen_level, user_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {

      await pool.query(sql, [latitude, longitude, land_size, ph_level, nitrogen, phosphorus, potassium, porosity, oxygen_level, user_id]);
      res.status(StatusCodes.CREATED).json({ message: 'Soil data added successfully' });

    } catch (error) {

      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });

    }

};

export default addSoilData;
