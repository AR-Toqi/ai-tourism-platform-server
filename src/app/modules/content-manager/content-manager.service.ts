import { prisma } from '../../../lib/prisma';
import { IUpdateDestination, IUpdateDestinationImage } from './content-manager.interface';
import { cloudinaryUpload, cloudinaryDelete, extractPublicId } from '../../utils/cloudinary';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

const updateDestinationDetails = async (id: string, payload: IUpdateDestination) => {
    const destination = await prisma.destination.findUnique({ where: { id } });
    if (!destination) {
        throw new AppError(httpStatus.NOT_FOUND, 'Destination not found');
    }

    const result = await prisma.destination.update({
        where: { id },
        data: payload,
    });
    return result;
};

const updateDestinationCoverImage = async (id: string, filePath: string) => {
    const destination = await prisma.destination.findUnique({ where: { id } });
    if (!destination) {
        throw new AppError(httpStatus.NOT_FOUND, 'Destination not found');
    }

    const uploadResult = await cloudinaryUpload(filePath, 'ai-tourism-platform/destinations/covers');

    // Delete old cover image from Cloudinary
    if (destination.coverImage && destination.coverImage.includes('cloudinary.com')) {
        const oldPublicId = extractPublicId(destination.coverImage);
        try {
            await cloudinaryDelete(oldPublicId);
        } catch (error) {
            console.error('Failed to delete old cover image from Cloudinary:', error);
        }
    }

    const result = await prisma.destination.update({
        where: { id },
        data: { coverImage: uploadResult.secure_url },
    });
    return result;
};

const addDestinationImages = async (destinationId: string, filePaths: string[]) => {
    const destination = await prisma.destination.findUnique({ where: { id: destinationId } });
    if (!destination) {
        throw new AppError(httpStatus.NOT_FOUND, 'Destination not found');
    }

    const uploadPromises = filePaths.map(filePath => cloudinaryUpload(filePath, 'ai-tourism-platform/destinations/gallery'));
    const uploadResults = await Promise.all(uploadPromises);

    const imageRecords = uploadResults.map((res, index) => ({
        destinationId,
        url: res.secure_url,
        order: index, // Default ordering
    }));

    await prisma.destinationImage.createMany({
        data: imageRecords,
    });

    const updatedGallery = await prisma.destinationImage.findMany({
        where: { destinationId },
    });

    return updatedGallery;
};

const updateDestinationGalleryImage = async (imageId: string, filePath?: string, payload?: IUpdateDestinationImage) => {
    const image = await prisma.destinationImage.findUnique({ where: { id: imageId } });
    if (!image) {
        throw new AppError(httpStatus.NOT_FOUND, 'Destination image not found');
    }

    const updateData: any = { ...payload };

    if (filePath) {
        const uploadResult = await cloudinaryUpload(filePath, 'ai-tourism-platform/destinations/gallery');
        updateData.url = uploadResult.secure_url;

        // Delete old image from Cloudinary
        if (image.url && image.url.includes('cloudinary.com')) {
            const oldPublicId = extractPublicId(image.url);
            try {
                await cloudinaryDelete(oldPublicId);
            } catch (error) {
                console.error('Failed to delete old gallery image from Cloudinary:', error);
            }
        }
    }

    const result = await prisma.destinationImage.update({
        where: { id: imageId },
        data: updateData,
    });

    return result;
};

const deleteDestinationGalleryImage = async (imageId: string) => {
    const image = await prisma.destinationImage.findUnique({ where: { id: imageId } });
    if (!image) {
        throw new AppError(httpStatus.NOT_FOUND, 'Destination image not found');
    }

    if (image.url && image.url.includes('cloudinary.com')) {
        const publicId = extractPublicId(image.url);
        try {
            await cloudinaryDelete(publicId);
        } catch (error) {
            console.error('Failed to delete gallery image from Cloudinary:', error);
        }
    }

    const result = await prisma.destinationImage.delete({
        where: { id: imageId },
    });

    return result;
};

export const ContentManagerService = {
    updateDestinationDetails,
    updateDestinationCoverImage,
    addDestinationImages,
    updateDestinationGalleryImage,
    deleteDestinationGalleryImage,
};
