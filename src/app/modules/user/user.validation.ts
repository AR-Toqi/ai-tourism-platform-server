import { z } from 'zod';

const updateProfileZodSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    image: z.string().url().optional(),
    // Add other updateable profile fields here
  }),
});

const updateStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(['ACTIVE', 'BLOCKED']),
  }),
});

export const UserValidation = {
  updateProfileZodSchema,
  updateStatusZodSchema,
};
