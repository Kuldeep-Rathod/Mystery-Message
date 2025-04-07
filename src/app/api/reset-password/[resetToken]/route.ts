import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User.model';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    await dbConnect();
    try {
        const { resetToken, newPass, confirmNewPass } = await req.json();
        console.log('reset Tken: ', resetToken);
        console.log('newPass: ', newPass);
        console.log('confirmNewPass: ', confirmNewPass);

        if (newPass !== confirmNewPass) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Password do not match',
                },
                { status: 400 }
            );
        }

        const forgottenUser = await UserModel.findOne({
            resetToken,
        });

        if (!forgottenUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User Not Found',
                },
                { status: 404 }
            );
        }

        const isTokenNotExpired =
            new Date(forgottenUser.resetTokenExpiry) > new Date();

        if (forgottenUser && isTokenNotExpired) {
            const newHashedPassword = await bcrypt.hash(newPass, 10);
            forgottenUser.password = newHashedPassword;
            await forgottenUser.save();

            return NextResponse.json(
                {
                    success: true,
                    message: 'Reset Password Successfully',
                },
                { status: 200 }
            );
        } else if (forgottenUser && !isTokenNotExpired) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Token expired, please get new reset token',
                },
                { status: 200 }
            );
        }
        return NextResponse.json(
            {
                success: false,
                message: 'Something went wrong',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error to register user', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error to register user',
            },
            { status: 500 }
        );
    }
};
