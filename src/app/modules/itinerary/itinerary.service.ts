import { prisma } from "../../../lib/prisma";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IAIPlanOutput, ICreateItinerary, IPromptParseOutput } from "./itinerary.interface";
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
        
        // Debug logging
        try {
            const fs = await import('fs/promises');
            await fs.writeFile('ai-debug.log', text);
        } catch (e) {
            // ignore logging errors
        }
        
        return JSON.parse(text) as IAIPlanOutput;
    } catch (error: any) {
        console.error("Gemini Generation Error:", error);
        
        // More detailed error logging
        try {
            const fs = await import('fs/promises');
            await fs.appendFile('ai-debug.log', `\n\nERROR: ${error.message}\n${error.stack}`);
        } catch (e) {}

        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to generate itinerary: ${error.message}`);
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

    try {
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
            if (aiGeneratedPlan.days && Array.isArray(aiGeneratedPlan.days)) {
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
                            data: day.activities.map((activity: any, index: number) => {
                                const costString = (activity.estimated_cost || "0").toString().replace(/[^0-9.]/g, '');
                                const cost = parseFloat(costString) || 0;
                                
                                return {
                                    itineraryDayId: createdDay.id,
                                    name: activity.activity || activity.name || "Activity",
                                    type: activity.type || "Activity",
                                    cost: cost,
                                    location: activity.location || "Various",
                                    time: activity.time || "Morning",
                                    order: index,
                                };
                            }),
                        });
                    }
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
        }, {
            timeout: 20000
        });

        return result;
    } catch (dbError: any) {
        console.error("Database Transaction Error:", dbError);
        try {
            const fs = await import('fs/promises');
            await fs.appendFile('ai-debug.log', `\n\nDB_ERROR: ${dbError.message}\n${dbError.stack}`);
        } catch (e) {}
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Database failed: ${dbError.message}`);
    }
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

const getSingleItinerary = async (id: string, userId: string, isAdmin = false) => {
    const whereConditions: any = { id };
    
    // Only filter by userId if NOT an admin
    if (!isAdmin) {
        whereConditions.userId = userId;
    }

    const result = await prisma.itinerary.findUnique({
        where: whereConditions,
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

const parsePromptWithAI = async (prompt: string): Promise<IPromptParseOutput> => {
    const aiPrompt = `
    Analyze the following travel request and extract structured information.
    Request: "${prompt}"

    Return ONLY a JSON object that follows this interface:
    interface IPromptParseOutput {
        destination?: string; // The city or country
        totalDays?: number; // Number of days as a number
        budgetEstimate?: number; // Estimated budget in USD as a number
        travelStyle?: string; // e.g., Luxury, Budget, Adventure, Family, Solo
        preferences?: string; // Any specific activities or interests
    }

    If a field is not mentioned, omit it from the JSON.
    `;

    try {
        const result = await genAI.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: "user", parts: [{ text: aiPrompt }] }],
            config: {
                responseMimeType: "application/json",
            },
        });

        const text = result.text;


        if (!text) {
            throw new Error("No response text from Gemini");
        }
        
        return JSON.parse(text) as IPromptParseOutput;
    } catch (error) {
        console.error("Gemini Parsing Error:", error);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to parse travel prompt. Please try again.");
    }
};

const getTrendingDestinations = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trending = await prisma.itinerary.groupBy({
        by: ['destinationId'],
        where: {
            createdAt: {
                gte: sevenDaysAgo,
            },
        },
        _count: {
            destinationId: true,
        },
        orderBy: {
            _count: {
                destinationId: 'desc',
            },
        },
        take: 5,
    });

    const destinationIds = trending.map((t) => t.destinationId);

    if (destinationIds.length === 0) {
        return await prisma.destination.findMany({ take: 5 });
    }

    const destinations = await prisma.destination.findMany({
        where: {
            id: {
                in: destinationIds,
            },
        },
    });

    return destinations;
};

export const ItineraryService = {
    createItinerary,
    getMyItineraries,
    getSingleItinerary,
    parsePromptWithAI,
    getTrendingDestinations,
};
