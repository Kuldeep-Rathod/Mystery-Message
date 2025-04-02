import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User.model';
import { sendVerificationEmail } from '@/utils/sendVerifyEmail';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    await dbConnect();
    try {
        const { username, email, password } = await req.json();

        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUserByUsername) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Username is already taken',
                },
                { status: 409 }
            );
        }

        const verifyCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const existingUserByMail = await UserModel.findOne({ email });

        if (existingUserByMail) {
            if (existingUserByMail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: 'User Already Exist, Please login',
                });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByMail.password = hashedPassword;
                existingUserByMail.verifyCode = verifyCode;
                existingUserByMail.verifyCodeExpiry = new Date(
                    Date.now() + 600
                );
                await existingUserByMail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);

            const verifyCodeExpiry = new Date();
            verifyCodeExpiry.setMinutes(verifyCodeExpiry.getMinutes() + 10);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry,
                isVerified: false,
                isAcceptingMessages: true,
                message: [],
            });

            await newUser.save();
        }

        //Send Verification Email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        console.log(emailResponse);

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
