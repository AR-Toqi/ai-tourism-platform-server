import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await ReviewService.createReview(req.body, user.id);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Review submitted successfully',
        data: result,
    });
});

const getDestinationReviews = catchAsync(async (req: Request, res: Response) => {
    const { destinationId } = req.params;
    const result = await ReviewService.getDestinationReviews(destinationId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Reviews fetched successfully',
        data: result,
    });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { id } = req.params;
    const result = await ReviewService.deleteReview(id as string, user.id, user.role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review deleted successfully',
        data: result,
    });
});

export const ReviewController = {
    createReview,
    getDestinationReviews,
    deleteReview,
};
