import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { SavedService } from "./saved.service";

const toggleSavedDestination = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { destinationId } = req.body;
    const result = await SavedService.toggleSavedDestination(destinationId, user.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: result.saved ? 'Destination saved' : 'Destination unsaved',
        data: result,
    });
});

const toggleSavedItinerary = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { itineraryId } = req.body;
    const result = await SavedService.toggleSavedItinerary(itineraryId, user.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: result.saved ? 'Itinerary saved' : 'Itinerary unsaved',
        data: result,
    });
});

const getMySavedItems = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await SavedService.getMySavedItems(user.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Saved items fetched successfully',
        data: result,
    });
});

export const SavedController = {
    toggleSavedDestination,
    toggleSavedItinerary,
    getMySavedItems,
};
