import { auth } from '../../../lib/auth';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { tokenHelpers } from '../../utils/token';
import { IRegister, ILogin, IChangePassword } from './auth.interface';
import { prisma } from '../../../lib/prisma';
import { JwtPayload } from 'jsonwebtoken';
import { User_Status } from '../../../generated/prisma';

const register = async (payload: IRegister) => {
  const result = await auth.api.signUpEmail({
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    },
  });

  if (!result.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not found');
  }

  const jwtPayload = {
    userId: result.user.id,
    email: result.user.email,
    role: result.user.role,
    name: result.user.name,
    status: result.user.status,
    isDeleted: result.user.isDeleted,
    emailVerified: result.user.emailVerified,
  };

  const accessToken = tokenHelpers.getAccessToken(jwtPayload);

  const refreshToken = tokenHelpers.getRefreshToken(jwtPayload);

  return {
    ...result,
    accessToken,
    refreshToken,
  };
};

const login = async (payload: ILogin) => {
  const result = await auth.api.signInEmail({
    body: {
      email: payload.email,
      password: payload.password,
    },
  });

  if (!result) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  if (result.user.isDeleted) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User is deleted');
  }

  if (!result.user.emailVerified) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Please verify your email');
  }

  const jwtPayload = {
    userId: result.user.id,
    email: result.user.email,
    role: result.user.role,
    name: result.user.name,
    status: result.user.status,
    isDeleted: result.user.isDeleted,
    emailVerified: result.user.emailVerified,
  };

  const accessToken = tokenHelpers.getAccessToken(jwtPayload);

  const refreshToken = tokenHelpers.getRefreshToken(jwtPayload);

  return {
    ...result,
    accessToken,
    refreshToken,
  };
};

const getNewToken = async (
  refreshToken: string,
  sessionToken: string,
) => {
  // 1. Check if session token exists in DB
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    },
  });

  if (!isSessionTokenExists) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid session token');
  }

  // 2. Verify the refresh token
  const decoded = tokenHelpers.verifyRefreshToken(refreshToken);

  if (!decoded) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }

  const data = decoded as JwtPayload;

  // 3. Generate new tokens (Rotation)
  const jwtPayload = {
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  };

  const newAccessToken = tokenHelpers.getAccessToken(jwtPayload);
  const newRefreshToken = tokenHelpers.getRefreshToken(jwtPayload);

  // 4. Update session in DB (Extend expiresAt)
  const { token } = await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      expiresAt: new Date(Date.now() + 60 * 60 * 24 * 1000), // 1 day
      updatedAt: new Date(),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    token, // Better Auth session token
    user: isSessionTokenExists.user,
  };
};

const changePassword = async (
  payload: IChangePassword,
  sessionToken: string,
) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    })
  });

  if (!session) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid session token');
  }

  const { currentPassword, newPassword } = payload;

  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    })
  });

  if (session.user.needsPasswordChange) {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        needsPasswordChange: false,
      }
    })
  };

  const jwtPayload = {
    userId: session.user.id,
    email: session.user.email,
    role: session.user.role,
    name: session.user.name,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified,
  };

  const accessToken = tokenHelpers.getAccessToken(jwtPayload);

  const refreshToken = tokenHelpers.getRefreshToken(jwtPayload);

  return {
    ...result,
    accessToken,
    refreshToken,
  };
};

const logoutUser = async (sessionToken: string) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    })
  });

  return result;
};

const verifyEmail = async (payload: { email: string, otp: string }) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email: payload.email,
      otp: payload.otp,
    }
  });

  if (result.user && result.user.emailVerified) {
    await prisma.user.update({
      where: {
        id: result.user.id,
      },
      data: {
        emailVerified: true,
      }
    })
  }
};

const forgotPassword = async (payload: { email: string }) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    }
  });
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (!isUserExist.emailVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email not verified");
  }

  if (isUserExist.isDeleted || isUserExist.status === User_Status.BLOCKED) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email: payload.email,
    }
  })
};

const resetPassword = async (payload: { email: string, otp: string, password: string }) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    }
  })

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!isUserExist.emailVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email not verified");
  }

  if (isUserExist.isDeleted || isUserExist.status === User_Status.BLOCKED) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  await auth.api.resetPasswordEmailOTP({
    body: {
      email: payload.email,
      otp: payload.otp,
      password: payload.password,
    }
  })

  if (isUserExist.needsPasswordChange) {
    await prisma.user.update({
      where: {
        id: isUserExist.id,
      },
      data: {
        needsPasswordChange: false,
      }
    })
  }

  await prisma.session.deleteMany({
    where: {
      userId: isUserExist.id,
    }
  })
};

export const AuthService = {
  register,
  login,
  getNewToken,
  changePassword,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
