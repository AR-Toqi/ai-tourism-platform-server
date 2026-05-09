import { prisma } from '../../../lib/prisma';
import ApiError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User_Status, user_role } from '../../../generated/prisma';
import { cloudinaryUpload, cloudinaryDelete, extractPublicId } from '../../utils/cloudinary';

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

const updateMyProfile = async (userId: string, payload: Partial<{ name: string; image: string }>, filePath?: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const updateData: any = { ...payload };

  if (filePath) {
      const uploadResult = await cloudinaryUpload(filePath, 'ai-tourism-platform/users');
      updateData.image = uploadResult.secure_url;

      // Delete old image from Cloudinary
      if (user.image && user.image.includes('cloudinary.com')) {
          const oldPublicId = extractPublicId(user.image);
          try {
              await cloudinaryDelete(oldPublicId);
          } catch (error) {
              console.error('Failed to delete old user image from Cloudinary:', error);
          }
      }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
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
