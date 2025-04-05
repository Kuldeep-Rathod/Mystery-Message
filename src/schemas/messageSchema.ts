import { z } from 'zod';

export const messageSchema = z.object({
    content: z.string().min(10, 'Content must be 10 character'),
    rating: z.number().min(0.5, 'Please provide a rating'),
});
