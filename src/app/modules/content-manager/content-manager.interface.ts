import { DestinationCategory } from '../../../../generated/prisma';

export interface IUpdateDestination {
    name?: string;
    description?: string;
    location?: string;
    country?: string;
    category?: DestinationCategory;
    latitude?: number;
    longitude?: number;
    budgetMin?: number;
    budgetMax?: number;
    isPublished?: boolean;
}

export interface IUpdateDestinationImage {
    altText?: string;
    order?: number;
}
