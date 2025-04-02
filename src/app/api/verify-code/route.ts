import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User.model';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    await dbConnect();
    try {
        const { username, code } = await req.json();
        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User Not Found',
                },
                { status: 404 }
            );
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return NextResponse.json(
                {
                    success: true,
                    message: 'User Verified Successfully',
                },
                { status: 200 }
            );
        } else if (!isCodeNotExpired) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Verification Code is expired',
                },
                { status: 400 }
            );
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Wrong Verification Code',
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.log('Error: Verify User', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error: Verify User',
            },
            { status: 500 }
        );
    }
};
