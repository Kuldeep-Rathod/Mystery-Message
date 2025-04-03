import { VerificationEmailTemplate } from '@/components/EmailTemplate';
import { resend } from '@/lib/resend';
import { ApiResponse } from '@/types/apiResponse';

export const sendVerificationEmail = async (
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> => {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: 'devcode.rtd@gmail.com',
            subject: 'Mystery Message | Verification Code',
            react: VerificationEmailTemplate({ username, otp: verifyCode }),
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
