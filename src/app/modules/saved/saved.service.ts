import { prisma } from "../../../lib/prisma";

const toggleSavedDestination = async (destinationId: string, userId: string) => {
    const existing = await prisma.savedDestination.findUnique({
        where: {
            userId_destinationId: {
                userId,
                destinationId,
            },
        },
    });

    if (existing) {
        await prisma.savedDestination.delete({
            where: { id: existing.id },
        });
        return { saved: false };
    } else {
        const result = await prisma.savedDestination.create({
            data: {
                userId,
                destinationId,
            },
        });
        return { saved: true, data: result };
    }
};

const toggleSavedItinerary = async (itineraryId: string, userId: string) => {
    const existing = await prisma.savedItinerary.findUnique({
        where: {
            userId_itineraryId: {
                userId,
                itineraryId,
            },
        },
    });

    if (existing) {
        await prisma.savedItinerary.delete({
            where: { id: existing.id },
        });
        return { saved: false };
    } else {
        const result = await prisma.savedItinerary.create({
            data: {
                userId,
                itineraryId,
            },
        });
        return { saved: true, data: result };
    }
};

const getMySavedItems = async (userId: string) => {
    const destinations = await prisma.savedDestination.findMany({
        where: { userId },
        include: { destination: true },
    });

    const itineraries = await prisma.savedItinerary.findMany({
        where: { userId },
        include: { itinerary: { include: { destination: true } } },
    });

    return { destinations, itineraries };
};

export const SavedService = {
    toggleSavedDestination,
    toggleSavedItinerary,
    getMySavedItems,
};
