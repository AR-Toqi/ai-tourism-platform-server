import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { DestinationService } from "./destination.service";

const createDestination = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await DestinationService.createDestination(req.body, user.id);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Destination created successfully',
        data: result,
    });
});

const getAllDestinations = catchAsync(async (req: Request, res: Response) => {
    const result = await DestinationService.getAllDestinations(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Destinations fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});

const getSingleDestination = catchAsync(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const result = await DestinationService.getSingleDestination(slug as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Destination fetched successfully',
        data: result,
    });
});

export const DestinationController = {
    createDestination,
    getAllDestinations,
    getSingleDestination,
};
