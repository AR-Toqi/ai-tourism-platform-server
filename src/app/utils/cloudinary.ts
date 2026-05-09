import { v2 as cloudinary } from 'cloudinary';
import { envConfig } from '../../config';
import fs from 'fs';

cloudinary.config({
    cloud_name: envConfig.CLOUDINARY.CLOUD_NAME,
    api_key: envConfig.CLOUDINARY.API_KEY,
    api_secret: envConfig.CLOUDINARY.API_SECRET,
});

export const cloudinaryUpload = async (filePath: string, folderName: string = 'ai-tourism-platform') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folderName,
        });

        // Remove the file from local storage after upload
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return result;
    } catch (error) {
        // Remove the file from local storage if upload fails
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        throw new Error('Failed to upload image to Cloudinary');
    }
};

export const cloudinaryDelete = async (publicId: string) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new Error('Failed to delete image from Cloudinary');
    }
};

// Helper function to extract public_id from a Cloudinary URL
export const extractPublicId = (url: string) => {
    const splitUrl = url.split('/');
    const lastElement = splitUrl[splitUrl.length - 1];
    const publicId = lastElement?.split('.')[0];
    const folder = splitUrl[splitUrl.length - 2];
    return `${folder}/${publicId}`;
};
