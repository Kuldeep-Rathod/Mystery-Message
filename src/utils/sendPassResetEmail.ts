import { PasswordResetEmailTemplate } from '@/components/ResetPassMailTemplate';
import { resend } from '@/lib/resend';
import { ApiResponse } from '@/types/apiResponse';

export const sendResetPasswordEmail = async (
    email: string,
    username: string,
    resetLink: string,
    tokenExpiry: string
): Promise<ApiResponse> => {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: 'devcode.rtd@gmail.com',
            subject: 'Mystery Message | Verification Code',
            react: PasswordResetEmailTemplate({
                username,
                resetLink,
                expiryTime: tokenExpiry,
            }),
        });
        return {
            success: true,
            message: 'Verification code send successfully',
        };
    } catch (error) {
        console.error('Error sending Verification code', error);
        return {
            success: false,
            message: 'Failed to send verification code',
        };
    }
};
