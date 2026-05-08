import { prisma } from "../../../lib/prisma";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { ICreateReview } from "./review.interface";

const createReview = async (payload: ICreateReview, userId: string) => {
    const destination = await prisma.destination.findUnique({
        where: { id: payload.destinationId }
    });

    if (!destination) {
        throw new AppError(httpStatus.NOT_FOUND, 'Destination not found');
    }

    const result = await prisma.$transaction(async (tx) => {
        // Create review
        const review = await tx.review.create({
            data: {
                ...payload,
                userId,
            },
        });

        // Update destination stats
        const allReviews = await tx.review.findMany({
            where: { destinationId: payload.destinationId }
        });

        const reviewCount = allReviews.length;
        const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount;

        await tx.destination.update({
            where: { id: payload.destinationId },
            data: {
                avgRating,
                reviewCount,
            }
        });

        return review;
    });

    return result;
};

const getDestinationReviews = async (destinationId: string) => {
    const result = await prisma.review.findMany({
        where: { destinationId, isHidden: false },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
    return result;
};

const deleteReview = async (reviewId: string, userId: string, userRole?: string) => {
    const review = await prisma.review.findUnique({
        where: { id: reviewId }
    });

    if (!review) {
        throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
    }

    const isAdminOrManager = userRole === 'ADMIN' || userRole === 'CONTENT_MANAGER';

    if (review.userId !== userId && !isAdminOrManager) {
        throw new AppError(httpStatus.FORBIDDEN, 'You can only delete your own reviews');
    }

    const result = await prisma.$transaction(async (tx) => {
        const deletedReview = await tx.review.delete({
            where: { id: reviewId }
        });

        // Re-calculate destination stats
        const allReviews = await tx.review.findMany({
            where: { destinationId: review.destinationId }
        });

        const reviewCount = allReviews.length;
        const avgRating = reviewCount > 0 
            ? allReviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount 
            : 0;

        await tx.destination.update({
            where: { id: review.destinationId },
            data: {
                avgRating,
                reviewCount,
            }
        });

        return deletedReview;
    });

    return result;
};

export const ReviewService = {
    createReview,
    getDestinationReviews,
    deleteReview,
};
