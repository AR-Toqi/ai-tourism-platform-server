import { prisma } from '../../../lib/prisma';
import ApiError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User_Status, user_role } from '../../../generated/prisma';

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      sessions: false,
      accounts: false,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

const updateMyProfile = async (userId: string, payload: Partial<{ name: string; image: string }>) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: payload,
  });

  return updatedUser;
};

const deleteMe = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const deletedUser = await prisma.user.delete({
    where: { id: userId },
  });

  return deletedUser;
};


export const UserService = {
  getMe,
  updateMyProfile,
  deleteMe
};
