import { DestinationCategory } from "../../../../generated/prisma";

export const DESTINATION_CATEGORIES: DestinationCategory[] = [
    "beach",
    "mountain",
    "city",
    "adventure",
    "cultural"
];

export const destinationSearchableFields = ['name', 'location', 'country', 'description'];