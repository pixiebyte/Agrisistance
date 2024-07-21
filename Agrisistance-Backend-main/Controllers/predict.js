import axios from 'axios';
import pool from '../DB/connect.js';

const predict = async (req, res) => {
  try {

    // Get the soil_id from the request body
    const soil_id = req.body.soil_id;
    const user_id = req.user.id;

    //################################################################################################################

    // Fetch the soil data and weather data from the database
    const [soil_result] = await pool.query('SELECT ph_level, nitrogen, phosphorus, potassium FROM soil_data WHERE user_id = ?', [user_id]);
    const soil_data = soil_result[0];

    const [weather_result] = await pool.query('SELECT temperature, humidity, rainfall FROM weather_data WHERE soil_id = ?', [soil_id]);
    const weather_data = weather_result[0];
   
    // Send the soil data and weather data to the FastAPI server
    const model_inputs = [soil_data.ph_level, weather_data.temperature, weather_data.rainfall, weather_data.humidity, soil_data.nitrogen, soil_data.phosphorus, soil_data.potassium];
  
    //################################################################################################################

    // Send the model inputs to the FastAPI server
    const response = await axios.post('http://localhost:8082/predict', {input: model_inputs});

    // Insert the recommendations into the database
    const [rec_result] = await pool.query(`INSERT INTO Recommendations (user_id, soil_id, weather_id) VALUES (?, ?, ?)`,[user_id, soil_id, weather_data.weather_id]);
  
    // Insert the predicted crop types into the database
    const cropValues = Object.values(response.data)[0]; 
    for (const value of cropValues) {
      await pool.query(`INSERT INTO crop_types (crop_type, rec_id) VALUES (?, ?)`, [value[0], rec_result.insertId]);
    }
    
    // Return the response from the FastAPI server
    res.json(response.data);

  } catch (error) {
    console.error('Error communicating with FastAPI server', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default predict;
