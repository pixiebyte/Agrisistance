import pool from '../DB/connect.js';
import { StatusCodes } from 'http-status-codes';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { extractPublicId, deleteImageFromCloudinary } from '../Util/cloudinaryDelete.js';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const UploadPFP = async (req, res) => {
    const user_id = req.user.id;
    const profile_picture = req.body.profile_picture;

    if (!profile_picture) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Please provide a profile picture' });
    }

    try {
        const [userRows] = await pool.query('SELECT profile_picture FROM Users WHERE user_id = ?', [user_id]);

        if (userRows[0].profile_picture) {
            const publicId = extractPublicId(userRows[0].profile_picture);
            if (publicId) {
                await deleteImageFromCloudinary(publicId, 'Users-Profile-Pictures');
            }
        }

        const uploadResult = await cloudinary.uploader.upload(profile_picture, { folder: 'Users-Profile-Pictures' });
        await pool.query('UPDATE Users SET profile_picture = ? WHERE user_id = ?', [uploadResult.secure_url, user_id]);

        res.status(StatusCodes.OK).json({ message: 'Profile picture uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
};

export default UploadPFP;
