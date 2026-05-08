import { z } from 'zod';

const createChatValidationSchema = z.object({
    body: z.object({
        title: z.string().optional(),
    }),
});

const sendMessageValidationSchema = z.object({
    body: z.object({
        chatId: z.string().min(1, 'Chat ID is required'),
        content: z.string().min(1, 'Content is required'),
    }),
});

export const AIChatValidation = {
    createChatValidationSchema,
    sendMessageValidationSchema,
};
