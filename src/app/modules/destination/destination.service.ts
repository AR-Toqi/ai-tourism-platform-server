import { Destination, Prisma } from "../../../generated/prisma";
import { prisma } from "../../../lib/prisma";
import slugify from "slugify";
import { destinationSearchableFields } from "./destination.constant";
import { ICreateDestination, IDestinationFilterRequest } from "./destination.interface";

const createDestination = async (payload: ICreateDestination, userId: string) => {
    const { images, ...destinationData } = payload;

    const slug = slugify(destinationData.name, { lower: true, strict: true });

    const result = await prisma.$transaction(async (tx) => {
        const destination = await tx.destination.create({
            data: {
                ...destinationData,
                slug,
                createdBy: userId,
            },
        });

        if (images && images.length > 0) {
            await tx.destinationImage.createMany({
                data: images.map((image) => ({
                    ...image,
                    destinationId: destination.id,
                })),
            });
        }

        return tx.destination.findUnique({
            where: { id: destination.id },
            include: { images: true },
        });
    });

    return result;
};

const getAllDestinations = async (query: IDestinationFilterRequest) => {
    const { searchTerm, category, budgetMin, budgetMax, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const whereConditions: Prisma.DestinationWhereInput = {
        isPublished: true,
    };



    if (searchTerm) {
        whereConditions.OR = destinationSearchableFields.map((field) => ({
            [field]: {
                contains: searchTerm,
                mode: 'insensitive',
            },
        }));
    }

    if (category) {
        whereConditions.category = category;
    }

    if (budgetMin || budgetMax) {
        whereConditions.AND = [
            ...(budgetMin ? [{ budgetMin: { gte: Number(budgetMin) } }] : []),
            ...(budgetMax ? [{ budgetMax: { lte: Number(budgetMax) } }] : []),
        ];
    }

    const result = await prisma.destination.findMany({
        where: whereConditions,
        include: {
            images: true,
        },
        skip,
        take,
        orderBy: {
            [sortBy as any]: sortOrder,
        },
    });

    const total = await prisma.destination.count({
        where: whereConditions,
    });

    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },
        data: result,
    };
};

const getSingleDestination = async (slug: string) => {
    const result = await prisma.destination.findUnique({
        where: {
            slug,
            isPublished: true,
        },
        include: {
            images: true,
            reviews: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
                take: 10,
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    return result;
};

export const DestinationService = {
    createDestination,
    getAllDestinations,
    getSingleDestination,
};
