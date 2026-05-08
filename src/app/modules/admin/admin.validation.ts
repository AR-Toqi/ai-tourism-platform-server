import { z } from 'zod';

const updateStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum(['ACTIVE', 'BLOCKED'] as [string, ...string[]], {
            message: 'Status must be ACTIVE or BLOCKED'
        }),
    }),
});

const updateRoleValidationSchema = z.object({
    body: z.object({
        role: z.enum(['USER', 'CONTENT_MANAGER'] as [string, ...string[]], {
            message: 'Role must be USER or CONTENT_MANAGER'
        }),
    }),
});

const updateAdminProfileValidationSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name cannot be empty").optional(),
        image: z.string().url("Invalid image URL").optional(),
    }),
});

export const AdminValidation = {
    updateStatusValidationSchema,
    updateRoleValidationSchema,
    updateAdminProfileValidationSchema,
};
