import { z } from 'zod';
import { usernameValidation } from './signupSchema';

export const resetPasswordSchema = z.object({
    username: usernameValidation,
});
