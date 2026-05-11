import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ContentManagerService } from './content-manager.service';
import AppError from '../../errors/AppError';
import { DestinationService } from '../destination/destination.service';

const getDestinationById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DestinationService.getDestinationById(id as string, true);

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Destination not found');
    }

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Destination fetched successfully',
        data: result,
    });
});

const updateDestinationDetails = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ContentManagerService.updateDestinationDetails(id as string, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Destination updated successfully',
        data: result,
    });
});

const updateDestinationCoverImage = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!req.file) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Please upload a cover image');
    }

    const result = await ContentManagerService.updateDestinationCoverImage(id as string, req.file.path);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Destination cover image updated successfully',
        data: result,
    });
});

const addDestinationImages = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Please upload at least one image');
    }

    const filePaths = req.files.map((file: any) => file.path);
    const result = await ContentManagerService.addDestinationImages(id as string, filePaths);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Destination gallery images added successfully',
        data: result,
    });
});

const updateDestinationGalleryImage = catchAsync(async (req: Request, res: Response) => {
    const { imageId } = req.params;
    const filePath = req.file ? req.file.path : undefined;

    const result = await ContentManagerService.updateDestinationGalleryImage(imageId as string, filePath, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Destination gallery image updated successfully',
        data: result,
    });
});

const deleteDestinationGalleryImage = catchAsync(async (req: Request, res: Response) => {
    const { imageId } = req.params;
    const result = await ContentManagerService.deleteDestinationGalleryImage(imageId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Destination gallery image deleted successfully',
        data: result,
    });
});

export const ContentManagerController = {
    getDestinationById,
    updateDestinationDetails,
    updateDestinationCoverImage,
    addDestinationImages,
    updateDestinationGalleryImage,
    deleteDestinationGalleryImage,
};
