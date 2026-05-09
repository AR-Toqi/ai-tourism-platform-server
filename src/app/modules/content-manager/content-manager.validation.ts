import { z } from 'zod';
import { DestinationCategory } from '../../../generated/prisma';

const updateDestinationValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        country: z.string().optional(),
        category: z.nativeEnum(DestinationCategory).optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        budgetMin: z.number().optional(),
        budgetMax: z.number().optional(),
        isPublished: z.boolean().optional(),
    }),
});

const updateDestinationImageValidationSchema = z.object({
    body: z.object({
        altText: z.string().optional(),
        order: z.number().int().optional(),
    }),
});

export const ContentManagerValidation = {
    updateDestinationValidationSchema,
    updateDestinationImageValidationSchema,
};
