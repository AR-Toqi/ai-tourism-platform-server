import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AIChatService } from "./aiChat.service";

const createChat = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const userId = user.id || user.userId;
    const result = await AIChatService.createChat(req.body, userId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Chat session created',
        data: result,
    });
});

const sendMessage = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const userId = user.id || user.userId;
    const result = await AIChatService.sendMessage(req.body, userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Message processed by AI',
        data: result,
    });
});

const getMyChats = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const userId = user.id || user.userId;
    const result = await AIChatService.getMyChats(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Chats fetched successfully',
        data: result,
    });
});

const getChatMessages = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const userId = user.id || user.userId;
    const { chatId } = req.params;
    const result = await AIChatService.getChatMessages(chatId as string, userId);

    if (!result) {
        return sendResponse(res, {
            statusCode: httpStatus.NOT_FOUND,
            success: false,
            message: 'Chat not found',
            data: null,
        });
    }

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Messages fetched successfully',
        data: result,
    });
});

export const AIChatController = {
    createChat,
    sendMessage,
    getMyChats,
    getChatMessages,
};
