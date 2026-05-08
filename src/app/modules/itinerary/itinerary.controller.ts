import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ItineraryService } from "./itinerary.service";

const createItinerary = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await ItineraryService.createItinerary(req.body, user.id);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Itinerary generated successfully (Mock)',
        data: result,
    });
});

const getMyItineraries = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await ItineraryService.getMyItineraries(user.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Itineraries fetched successfully',
        data: result,
    });
});

const getSingleItinerary = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { id } = req.params;
    const result = await ItineraryService.getSingleItinerary(id as string, user.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Itinerary fetched successfully',
        data: result,
    });
});

export const ItineraryController = {
    createItinerary,
    getMyItineraries,
    getSingleItinerary,
};
