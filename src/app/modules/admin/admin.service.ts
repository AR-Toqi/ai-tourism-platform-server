import { prisma } from "../../../lib/prisma";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User_Status, user_role } from "../../../generated/prisma";

const getNormalUsers = async () => {
    return await prisma.user.findMany({
        where: { role: user_role.USER, isDeleted: false },
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
            createdAt: true,
            image: true,
        },
        orderBy: { createdAt: 'desc' }
    });
};

const getContentManagers = async () => {
    return await prisma.user.findMany({
        where: { role: user_role.CONTENT_MANAGER, isDeleted: false },
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
            createdAt: true,
            image: true,
        },
        orderBy: { createdAt: 'desc' }
    });
};

const changeUserStatus = async (userId: string, status: User_Status) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

    return await prisma.user.update({
        where: { id: userId },
        data: { status }
    });
};

const changeUserRole = async (userId: string, role: user_role) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

    if (user.role === user_role.ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, 'Cannot change the role of an Admin');
    }

    return await prisma.user.update({
        where: { id: userId },
        data: { role }
    });
};

const softDeleteUser = async (userId: string) => {
    const user = await prisma.user.findUnique({ 
        where: { id: userId },
        include: { itineraries: true } // Checking if they have generated itineraries
    });

    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

    if (user.role === user_role.ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, 'Cannot delete an Admin account');
    }

    // TODO: Add Booking validation here when the Booking model is created
    // Example:
    // const hasBookings = await prisma.booking.findFirst({ where: { userId } });
    // if (hasBookings) throw new AppError(httpStatus.BAD_REQUEST, 'User cannot be deleted because they have active bookings');

    // Current Itinerary fallback validation (based on assumption)
    if (user.itineraries.length > 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User cannot be deleted because they have generated itineraries (acting as trips)');
    }

    return await prisma.user.update({
        where: { id: userId },
        data: { 
            isDeleted: true,
            deletedAt: new Date()
        }
    });
};

const updateAdminProfile = async (userId: string, payload: { name?: string, image?: string }) => {
    return await prisma.user.update({
        where: { id: userId },
        data: payload
    });
};

const getAllItineraries = async () => {
    return await prisma.itinerary.findMany({
        include: {
            user: { select: { name: true, email: true } },
            destination: { select: { name: true, country: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};

const getItineraryById = async (id: string) => {
    const itinerary = await prisma.itinerary.findUnique({
        where: { id },
        include: {
            user: { select: { name: true, email: true } },
            destination: true,
            days: {
                include: { activities: true }
            }
        }
    });

    if (!itinerary) throw new AppError(httpStatus.NOT_FOUND, 'Itinerary not found');

    return itinerary;
};

const getDashboardStats = async () => {
    const [
        totalNormalUsers,
        totalContentManagers,
        totalDestinations,
        totalItineraries,
        totalReviews
    ] = await Promise.all([
        prisma.user.count({ where: { role: user_role.USER, isDeleted: false } }),
        prisma.user.count({ where: { role: user_role.CONTENT_MANAGER, isDeleted: false } }),
        prisma.destination.count(),
        prisma.itinerary.count(),
        prisma.review.count()
    ]);

    return {
        users: {
            normal: totalNormalUsers,
            contentManagers: totalContentManagers,
            total: totalNormalUsers + totalContentManagers // Excludes admins from total metric
        },
        platform: {
            destinations: totalDestinations,
            itineraries: totalItineraries,
            reviews: totalReviews
        }
    };
};

export const AdminService = {
    getNormalUsers,
    getContentManagers,
    changeUserStatus,
    changeUserRole,
    softDeleteUser,
    updateAdminProfile,
    getAllItineraries,
    getItineraryById,
    getDashboardStats,
};
