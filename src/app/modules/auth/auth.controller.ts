import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { AuthService } from './auth.service';
import { tokenHelpers } from '../../utils/token';
import AppError from '../../errors/AppError';
import { CookieUtils } from '../../utils/cookie';

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);

  const { user, token, accessToken, refreshToken } = result;

  tokenHelpers.setAccessTokenCookie(res, accessToken);
  tokenHelpers.setRefreshTokenCookie(res, refreshToken);

  if (token) {
    tokenHelpers.setBetterAuthSessionCookie(res, token);
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully',
    data: { user, accessToken, refreshToken },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  const { user, token, accessToken, refreshToken } = result;

  tokenHelpers.setAccessTokenCookie(res, accessToken);
  tokenHelpers.setRefreshTokenCookie(res, refreshToken);

  if (token) {
    tokenHelpers.setBetterAuthSessionCookie(res, token);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: { user, accessToken, refreshToken },
  });
});

const getNewToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const sessionToken = req.cookies['better-auth.session_token'];

  if (!refreshToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Refresh token not found');
  }
  if (!sessionToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Session token not found');
  }

  const result = await AuthService.getNewToken(refreshToken, sessionToken);

  const { accessToken: newAccessToken, refreshToken: newRefreshToken, token } = result;

  tokenHelpers.setAccessTokenCookie(res, newAccessToken);
  tokenHelpers.setRefreshTokenCookie(res, newRefreshToken);

  if (token) {
    tokenHelpers.setBetterAuthSessionCookie(res, token);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Token refreshed successfully',
    data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const sessionToken = req.cookies['better-auth.session_token'];
  const result = await AuthService.changePassword(req.body, sessionToken);

  const { accessToken, refreshToken } = result;

  tokenHelpers.setAccessTokenCookie(res, accessToken);
  tokenHelpers.setRefreshTokenCookie(res, refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
    data: result,
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const sessionToken = CookieUtils.getCookie(req, 'better-auth.session_token');
  const result = await AuthService.logoutUser(sessionToken);

  if (!sessionToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Session token not found');
  }

  CookieUtils.clearCookie(res, 'accessToken');
  CookieUtils.clearCookie(res, 'refreshToken');
  CookieUtils.clearCookie(res, 'better-auth.session_token');

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged out successfully',
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  await AuthService.verifyEmail(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Email verified successfully',
    data: null,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP sent to email for password reset',
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.resetPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successfully',
    data: null,
  });
});

export const AuthController = {
  register,
  login,
  getNewToken,
  changePassword,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
