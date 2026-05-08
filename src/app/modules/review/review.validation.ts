import { z } from 'zod';

const createReviewValidationSchema = z.object({
    body: z.object({
        destinationId: z.string().min(1, 'Destination ID is required'),
        rating: z.number().min(1).max(5),
        comment: z.string().min(10, 'Comment must be at least 10 characters'),
    }),
});

export const ReviewValidation = {
    createReviewValidationSchema,
};
