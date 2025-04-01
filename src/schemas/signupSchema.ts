import { z } from 'zod';

export const usernameValidation = z
    .string()
    .min(2, 'Please enter username atleast 2 character')
    .max(20, 'Please enter uName under 20 character')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special character');

export const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: 'Invalid Email' }),
    password: z
        .string()
        .min(6, { message: 'Password must be atleast 6 character' }),
});
