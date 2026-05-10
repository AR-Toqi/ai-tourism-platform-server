import { Destination, Prisma } from "../../../../generated/prisma";
import { prisma } from "../../../lib/prisma";
import slugify from "slugify";
import { destinationSearchableFields } from "./destination.constant";
import { ICreateDestination, IDestinationFilterRequest } from "./destination.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createDestination = async (payload: ICreateDestination, userId: string) => {
    const { images, ...destinationData } = payload;

    const slug = slugify(destinationData.name, { lower: true, strict: true });

    const existingDestination = await prisma.destination.findUnique({ where: { slug } });
    if (existingDestination) {
        throw new AppError(httpStatus.BAD_REQUEST, "A destination with this name already exists");
    }

    const result = await prisma.$transaction(async (tx) => {
        const destinationDataToCreate: Prisma.DestinationCreateInput = {
            name: destinationData.name,
            description: destinationData.description,
            location: destinationData.location,
            country: destinationData.country,
            category: destinationData.category,
            budgetMin: destinationData.budgetMin,
            budgetMax: destinationData.budgetMax,
            coverImage: destinationData.coverImage,
            isPublished: destinationData.isPublished ?? false,
            slug,
            user: {
                connect: { id: userId }
            }
        };

        if (images && images.length > 0) {
            destinationDataToCreate.images = {
                create: images.map(img => {
                    const imgData: any = { url: img.url };
                    if (img.altText !== undefined) imgData.altText = img.altText;
                    if (img.order !== undefined) imgData.order = img.order;
                    return imgData;
                })
            };
        }

        const destination = await tx.destination.create({
            data: destinationDataToCreate,
            include: {
                images: true
            }
        });

        return destination;
    });

    return result;
};

const getAllDestinations = async (query: IDestinationFilterRequest & { includeDrafts?: boolean }) => {
    const { searchTerm, category, budgetMin, budgetMax, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', includeDrafts = false } = query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const whereConditions: Prisma.DestinationWhereInput = {};

    if (!includeDrafts) {
        whereConditions.isPublished = true;
    }



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

const getSingleDestination = async (slug: string, includeDrafts = false) => {
    const whereConditions: Prisma.DestinationWhereInput = { slug };

    if (!includeDrafts) {
        whereConditions.isPublished = true;
    }

    const result = await prisma.destination.findUnique({
        where: {
            slug,
        },
        // We use a findFirst if we need to filter by more than just the unique ID/Slug with non-unique fields
        // But since findUnique only accepts unique fields, we'll check isPublished manually if needed or use findFirst
    });

    // If we used findUnique, we must filter manually if isPublished is required
    if (result && !includeDrafts && !result.isPublished) {
        return null;
    }

    if (!result) return null;

    // Fetch full details with includes
    return await prisma.destination.findUnique({
        where: { id: result.id },
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
};

export const DestinationService = {
    createDestination,
    getAllDestinations,
    getSingleDestination,
};
