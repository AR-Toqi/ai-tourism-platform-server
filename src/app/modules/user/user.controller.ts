import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const getMe = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await UserService.getMe(user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await UserService.updateMyProfile(user.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

const deleteMe = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await UserService.deleteMe(user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User account deleted successfully',
    data: result,
  });
});

export const UserController = {
  getMe,
  updateMyProfile,
  deleteMe,
};
