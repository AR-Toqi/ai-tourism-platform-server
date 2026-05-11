import { DestinationCategory } from "../../../../generated/prisma";

export interface IDestinationImage {
    url: string;
    altText?: string;
    order?: number;
}

export interface ICreateDestination {
    name: string;
    location: string;
    country: string;
    category: DestinationCategory;
    description: string;
    budgetMin: number;
    budgetMax: number;
    coverImage?: string;
    isPublished?: boolean;
    latitude?: number;
    longitude?: number;
    images?: IDestinationImage[];
}

export interface IDestinationFilterRequest {
    searchTerm?: string;
    category?: DestinationCategory;
    budgetMin?: string | number;
    budgetMax?: string | number;
    page?: string | number;
    limit?: string | number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
