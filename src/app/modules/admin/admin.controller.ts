import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AdminService } from "./admin.service";

const getNormalUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getNormalUsers();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Normal users fetched successfully',
        data: result,
    });
});

const getContentManagers = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getContentManagers();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Content managers fetched successfully',
        data: result,
    });
});

const changeUserStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await AdminService.changeUserStatus(id as string, status);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User status updated successfully',
        data: result,
    });
});

const changeUserRole = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;
    const result = await AdminService.changeUserRole(id as string, role);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User role updated successfully',
        data: result,
    });
});

const softDeleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.softDeleteUser(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User soft-deleted successfully',
        data: result,
    });
});

const updateAdminProfile = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await AdminService.updateAdminProfile(user.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin profile updated successfully',
        data: result,
    });
});

const getAllItineraries = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getAllItineraries();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All itineraries fetched successfully',
        data: result,
    });
});

const getItineraryById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.getItineraryById(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Itinerary fetched successfully',
        data: result,
    });
});

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getDashboardStats();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Dashboard stats fetched successfully',
        data: result,
    });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getAllReviews();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All reviews fetched successfully',
        data: result,
    });
});

export const AdminController = {
    getNormalUsers,
    getContentManagers,
    changeUserStatus,
    changeUserRole,
    softDeleteUser,
    updateAdminProfile,
    getAllItineraries,
    getItineraryById,
    getDashboardStats,
    getAllReviews,
};
