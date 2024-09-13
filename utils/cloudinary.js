import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

dotenv.config({ path: path.resolve('config/.env') });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const testUpload = async () => {
    try {
        const result = await cloudinary.uploader.upload('path/to/your/test/image.jpg', {
            folder: 'Ecommerce/Categories/test'
        });
    } catch (error) {
    }
};

testUpload();
export default cloudinary