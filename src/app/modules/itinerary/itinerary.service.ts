import { prisma } from "../../../lib/prisma";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IAIPlanOutput, ICreateItinerary } from "./itinerary.interface";
import { genAI } from "../../../config/gemini";

const generateItineraryWithAI = async (payload: ICreateItinerary): Promise<IAIPlanOutput> => {
    const prompt = `
    You are an expert travel planner. Generate a highly detailed and optimized travel itinerary for the following request:
    - Destination: ${payload.title}
    - Duration: ${payload.totalDays} days
    - Budget Level: ${payload.budgetEstimate} USD
    - Travel Style: ${payload.travelStyle}
    - Special Preferences: ${payload.preferences || 'None'}

    Return ONLY a JSON object that strictly follows this interface:
    interface IItineraryActivity {
        time: string;
        activity: string;
        location: string;
        estimated_cost: string; // e.g., "20 USD" or "Free"
        notes: string;
    }

    interface IItineraryDay {
        day: number;
        theme: string;
        activities: IItineraryActivity[];
    }

    interface IAIPlanOutput {
        destination: string;
        duration: number;
        total_budget_estimate: number;
        days: IItineraryDay[];
        budget_breakdown: Record<string, string>; // e.g., {"Food": "20%", "Transport": "30%"}
        tips: string[];
        best_time_to_visit: string;
    }

    Ensure the activities are realistic for the location and time specified.
    `;

    try {
        const result = await genAI.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
            },
        });

        const text = result.text;
        if (!text) {
            throw new Error("No response text from Gemini");
        }
        
        return JSON.parse(text) as IAIPlanOutput;
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to generate itinerary with AI. Please try again.");
    }
};

const createItinerary = async (payload: ICreateItinerary, userId: string) => {
    const destination = await prisma.destination.findUnique({
        where: { id: payload.destinationId }
    });

    if (!destination) {
        throw new AppError(httpStatus.NOT_FOUND, 'Destination not found');
    }

    // Real AI integration
    const aiGeneratedPlan = await generateItineraryWithAI(payload);

    const result = await prisma.$transaction(async (tx) => {
        const itinerary = await tx.itinerary.create({
            data: {
                userId,
                destinationId: payload.destinationId,
                title: payload.title,
                totalDays: payload.totalDays,
                budgetEstimate: payload.budgetEstimate,
                travelStyle: payload.travelStyle,
                startDate: payload.startDate ? new Date(payload.startDate) : null,
                aiContextInput: payload as any,
                aiGeneratedPlan: aiGeneratedPlan as any,
            },
        });

        // Store structured days and activities
        for (const day of aiGeneratedPlan.days) {
            const createdDay = await tx.itineraryDay.create({
                data: {
                    itineraryId: itinerary.id,
                    dayNumber: day.day,
                    theme: day.theme,
                },
            });

            if (day.activities && day.activities.length > 0) {
                await tx.itineraryActivity.createMany({
                    data: day.activities.map((activity: any, index: number) => ({
                        itineraryDayId: createdDay.id,
                        name: activity.activity,
                        type: "Activity",
                        cost: parseFloat(activity.estimated_cost) || 0,
                        location: activity.location,
                        time: activity.time,
                        order: index,
                    })),
                });
            }
        }

        return tx.itinerary.findUnique({
            where: { id: itinerary.id },
            include: {
                days: {
                    include: { activities: true }
                }
            },
        });
    });

    return result;
};

const getMyItineraries = async (userId: string) => {
    const result = await prisma.itinerary.findMany({
        where: { userId },
        include: {
            destination: true,
            days: {
                include: { activities: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
    return result;
};

const getSingleItinerary = async (id: string, userId: string) => {
    const result = await prisma.itinerary.findUnique({
        where: { id, userId },
        include: {
            destination: true,
            days: {
                include: { activities: true }
            }
        }
    });

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Itinerary not found or unauthorized');
    }

    return result;
};

export const ItineraryService = {
    createItinerary,
    getMyItineraries,
    getSingleItinerary,
};
