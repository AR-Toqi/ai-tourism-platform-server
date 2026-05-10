import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const getMe = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const userId = user.userId || user.id;
  const result = await UserService.getMe(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const userId = user.userId || user.id;
  const filePath = req.file ? req.file.path : undefined;
  const result = await UserService.updateMyProfile(userId, req.body, filePath);


  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

const deleteMe = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const userId = user.userId || user.id;
  const result = await UserService.deleteMe(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User account deleted successfully',
    data: result,
  });
});

const getStats = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const userId = user.userId || user.id;
  const result = await UserService.getStats(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User statistics retrieved successfully',
    data: result,
  });
});

export const UserController = {
  getMe,
  updateMyProfile,
  deleteMe,
  getStats,
};

