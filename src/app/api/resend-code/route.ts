import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User.model';
import { sendVerificationEmail } from '@/utils/sendVerifyEmail';
import { NextRequest, NextResponse } from 'next/server';

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

        const verifyCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        user.verifyCode = verifyCode;
        const email = user.email;
        user.verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();

        //Send Verification Email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
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
