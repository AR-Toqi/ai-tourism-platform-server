import { z } from 'zod';
import { DESTINATION_CATEGORIES } from './destination.constant';

const createDestinationImageValidationSchema = z.object({
    url: z.string().url('Invalid image URL'),
    altText: z.string().optional(),
    order: z.number().int().optional(),
});

const createDestinationValidationSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        description: z.string().min(1, 'Description is required'),
        location: z.string().min(1, 'Location is required'),
        country: z.string().min(1, 'Country is required'),
        category: z.enum(DESTINATION_CATEGORIES as [string, ...string[]], {
            message: 'Category is required',
        }),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        budgetMin: z.number({ message: 'Minimum budget must be a number' }),
        budgetMax: z.number({ message: 'Maximum budget must be a number' }),
        coverImage: z.string().url('Invalid cover image URL').optional(),
        isPublished: z.boolean().optional(),
        images: z.array(createDestinationImageValidationSchema).optional(),
    }),
});

const updateDestinationValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        country: z.string().optional(),
        category: z.enum(DESTINATION_CATEGORIES as [string, ...string[]]).optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        budgetMin: z.number().optional(),
        budgetMax: z.number().optional(),
        coverImage: z.string().url('Invalid cover image URL').optional(),
        images: z.array(createDestinationImageValidationSchema).optional(),
        isPublished: z.boolean().optional(),
    }),
});

export const DestinationValidation = {
    createDestinationValidationSchema,
    updateDestinationValidationSchema,
};
