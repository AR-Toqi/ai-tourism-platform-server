import { z } from 'zod';

const toggleSavedDestinationValidationSchema = z.object({
    body: z.object({
        destinationId: z.string().min(1, 'Destination ID is required'),
    }),
});

const toggleSavedItineraryValidationSchema = z.object({
    body: z.object({
        itineraryId: z.string().min(1, 'Itinerary ID is required'),
    }),
});

export const SavedValidation = {
    toggleSavedDestinationValidationSchema,
    toggleSavedItineraryValidationSchema,
};
