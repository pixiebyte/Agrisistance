import pool from '../DB/connect.js';
import QRCode from 'qrcode';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const generateCodeQr = async (data) => {
    try {
        if (!data) {
            throw new Error('Data is required');
        }

        const qrCodeUrl = await QRCode.toDataURL(data);
        
        // Upload QR code image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(qrCodeUrl, {
            folder: 'qrcodes', // Optional folder in Cloudinary
            resource_type: 'image' // Set resource type to image
        });

        // Extract public URL of the uploaded image from Cloudinary response
        const qrCodeCloudinaryUrl = uploadResult.secure_url;

        // Insert Cloudinary URL into database
        const [result] = await pool.query(`INSERT INTO qr_code (qrcode_img, camion_id) VALUES (?, ?)`, [qrCodeCloudinaryUrl, data]);
        const id = result.insertId;

        return qrCodeCloudinaryUrl; // Return the Cloudinary URL where the QR code is stored
    } catch (error) {
        console.error(error);
        throw error; // Throw the error so it can be handled by the caller (AddCamion controller)
    }
}

export default generateCodeQr;
