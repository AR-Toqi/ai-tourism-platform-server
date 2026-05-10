import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ItineraryService } from "./itinerary.service";

const createItinerary = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const userId = user.userId || user.id;
    const result = await ItineraryService.createItinerary(req.body, userId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Itinerary generated successfully',
        data: result,
    });
});

const getMyItineraries = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const userId = user.userId || user.id;
    const result = await ItineraryService.getMyItineraries(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Itineraries fetched successfully',
        data: result,
    });
});

const getSingleItinerary = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const userId = user.userId || user.id;
    const { id } = req.params;
    const isAdmin = user.role === 'ADMIN' || user.role === 'CONTENT_MANAGER';
    
    const result = await ItineraryService.getSingleItinerary(id as string, userId, isAdmin);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Itinerary fetched successfully',
        data: result,
    });
});


const parsePrompt = catchAsync(async (req: Request, res: Response) => {
    const { prompt } = req.body;
    const result = await ItineraryService.parsePromptWithAI(prompt);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Prompt parsed successfully',
        data: result,
    });
});

const getTrendingDestinations = catchAsync(async (req: Request, res: Response) => {
    const result = await ItineraryService.getTrendingDestinations();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Trending destinations fetched successfully',
        data: result,
    });
});

export const ItineraryController = {
    createItinerary,
    getMyItineraries,
    getSingleItinerary,
    parsePrompt,
    getTrendingDestinations,
};

