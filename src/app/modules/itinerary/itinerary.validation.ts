import { z } from 'zod';

const createItineraryValidationSchema = z.object({
    body: z.object({
        destinationId: z.string().min(1, 'Destination ID is required'),
        title: z.string().min(1, 'Title is required'),
        totalDays: z.number().min(1, 'Total days must be at least 1'),
        budgetEstimate: z.number({ message: 'Budget estimate must be a number' }),
        travelStyle: z.string().min(1, 'Travel style is required'),
        preferences: z.string().optional(),
    }),
});

export const ItineraryValidation = {
    createItineraryValidationSchema,
};
