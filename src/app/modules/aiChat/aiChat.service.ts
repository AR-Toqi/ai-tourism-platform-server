import { prisma } from "../../../lib/prisma";
import { MessageRole } from "../../../generated/prisma";
import { genAI } from "../../../config/gemini";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";

const createChat = async (payload: { title?: string }, userId: string) => {
    const result = await prisma.aIChat.create({
        data: {
            userId,
            title: payload.title || 'New Conversation',
        },
    });
    return result;
};

const sendMessage = async (payload: { chatId: string, content: string }, userId: string) => {
    // 1. Verify chat ownership
    const chat = await prisma.aIChat.findUnique({
        where: { id: payload.chatId, userId }
    });

    if (!chat) {
        throw new AppError(httpStatus.NOT_FOUND, "Chat session not found");
    }

    // 2. Fetch history (last 10 messages for context)
    const historyMessages = await prisma.aIMessage.findMany({
        where: { chatId: payload.chatId },
        orderBy: { createdAt: 'asc' },
        take: 10,
    });

    // 3. Format history for the new SDK
    const chatHistory = historyMessages.map(msg => ({
        role: msg.role === MessageRole.user ? "user" : "model",
        parts: [{ text: msg.content }],
    }));

    // 4. Save user message
    await prisma.aIMessage.create({
        data: {
            chatId: payload.chatId,
            role: MessageRole.user,
            content: payload.content,
        },
    });

    // 5. Initialize Chat with new SDK using generateContent directly
    const formattedHistory = historyMessages.map(msg => ({
        role: msg.role === MessageRole.user ? "user" : "model",
        parts: [{ text: msg.content }],
    }));

    // Add current user message
    formattedHistory.push({
        role: "user",
        parts: [{ text: payload.content }]
    });

    try {
        const result = await genAI.models.generateContent({
            model: "models/gemini-3.1-flash-lite-preview",
            contents: formattedHistory as any,
            config: {
                systemInstruction: "You are a specialized Travel Assistant for the AI Tourism Platform. Help users with destination advice, travel tips, and itinerary refinements. Be concise, friendly, and expert.",
            },
        });

        const aiResponse = result.text;

        if (!aiResponse) {
            throw new Error("No response from AI");
        }

        // 6. Save AI message
        const finalResult = await prisma.aIMessage.create({
            data: {
                chatId: payload.chatId,
                role: MessageRole.assistant,
                content: aiResponse,
            },
        });

        // 7. Update chat timestamp
        await prisma.aIChat.update({
            where: { id: payload.chatId },
            data: { updatedAt: new Date() }
        });

        return finalResult;
    } catch (error: any) {
        console.error("Gemini Chat Error:", error);
        const errorMessage = error?.message || "AI Chat failed. Please try again.";
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Gemini Error: ${errorMessage}`);
    }
};

const getMyChats = async (userId: string) => {
    const result = await prisma.aIChat.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
    });
    return result;
};

const getChatMessages = async (chatId: string, userId: string) => {
    // Verify chat ownership
    const chat = await prisma.aIChat.findFirst({
        where: { id: chatId, userId },
    });

    if (!chat) return null;

    const result = await prisma.aIMessage.findMany({
        where: { chatId },
        orderBy: { createdAt: 'asc' },
    });
    return result;
};

export const AIChatService = {
    createChat,
    sendMessage,
    getMyChats,
    getChatMessages,
};
