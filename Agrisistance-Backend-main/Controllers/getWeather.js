import jwt from 'jsonwebtoken';
import fetch from 'node-fetch'; 
import pool from '../DB/connect.js'; 
import dotenv from 'dotenv';

dotenv.config();

const getWeatherData = async (req , res) => {
    try {
        

        const { City , soil_id } = req.body;

        // Fetch weather data from the API
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json'
            }
        };

        const response = await fetch(`https://api.tomorrow.io/v4/weather/realtime?location=${City}&units=metric&apikey=${process.env.TOMMOROW_API_KEY}`, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error fetching weather data');
        }

        console.log(data.data)

        // Extract weather conditions
        const { temperature, humidity, precipitationProbability } = data.data.values;

        // Update the Weather_Data table with the fetched weather data
        const deletesql = `DELETE FROM Weather_Data WHERE soil_id = ?`;
        await pool.query(deletesql, [soil_id]);
        const sql = `INSERT INTO Weather_Data (temperature, humidity, rainfall, soil_id) VALUES (?, ?, ?, ?)`;
        await pool.query(sql, [temperature, humidity, precipitationProbability, soil_id]);

        // Return the weather data
        return res.json({ temperature, humidity, precipitation :precipitationProbability });
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        throw error;
    }
};

export default getWeatherData;














//OpenWeather API
/*
import pool from '../DB/connect.js';
import dotenv from 'dotenv';
import request from 'request';

dotenv.config();

// Function to map OpenWeather descriptions to our custom weather types
const mapWeatherToEnumeration = (weatherDescription) => {
    const description = weatherDescription.toLowerCase();

    if (description.includes('snow')) return 'Neigeux';
    if (description.includes('clear')) return 'Ensoleillé';
    if (description.includes('wind')) return 'Venteux';
    if (description.includes('rain') || description.includes('drizzle') || description.includes('thunderstorm')) return 'Pluvieux';
    if (description.includes('cloud')) return 'Nuageux';
    
    return 'Unknown';  // default case if no match
};

const getWeather = async (req, res) => {
    try {
        const barageId = req.body.barageId;
        const [barageRows] = await pool.query('SELECT City FROM barage_table WHERE barage_id = ?', [barageId]);

        if (barageRows.length === 0) {
            return res.status(404).json({ error: 'Barage not found' });
        }

        const City = barageRows[0].City;
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${City},DZ&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;

        request(url, (err, response, body) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            const weather = JSON.parse(body);
            if (weather.main === undefined) {
                return res.status(404).json({ error: 'City not found or API error' });
            } else {
                const weatherDescription = weather.weather[0].main;
                const weatherEnum = mapWeatherToEnumeration(weatherDescription);

                return res.status(200).json({ 
                    weather: weather, 
                    customWeatherDescription: `The weather in ${weather.name} is currently ${weatherEnum}.`
                });
            }
        });
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default getWeather;
*/
