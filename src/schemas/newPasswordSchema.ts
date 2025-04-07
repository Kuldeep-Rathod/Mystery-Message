import { z } from 'zod';

export const newPasswordSchema = z
    .object({
        password: z
            .string()
            .min(6, { message: 'Password must be atleast 6 character' }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });
