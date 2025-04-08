import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User.model';
import { sendResetPasswordEmail } from '@/utils/sendPassResetEmail';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

export const POST = async (req: NextRequest) => {
    await dbConnect();

    try {
        const { username } = await req.json();

        const user = await UserModel.findOne({ username });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User Not Found',
                },
                { status: 404 }
            );
        }

        const token = uuid();
        const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.resetToken = token;
        user.resetTokenExpiry = tokenExpiry;
        await user.save();

        const baseUrl = 'https://mystery-message-snowy-one.vercel.app/';

        const resetLink = `${baseUrl}/reset-password/${token}`;

        // Send Verification Email
        const emailResponse = await sendResetPasswordEmail(
            user.email,
            username,
            resetLink,
            '10 Minutes'
        );

        if (!emailResponse.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Email Verification Code Sent Successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error to send verification code', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error to send OTP',
            },
            { status: 500 }
        );
    }
};
