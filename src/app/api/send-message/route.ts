import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User.model';
import { NextRequest, NextResponse } from 'next/server';
import { Message } from '@/model/User.model';

export const POST = async (req: NextRequest) => {
    await dbConnect();

    const { username, content, rating } = await req.json();

    if (!username || !content || !rating) {
        return NextResponse.json(
            {
                success: false,
                message: 'Required all fields',
            },
            { status: 404 }
        );
    }

    try {
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

        if (!user.isAcceptingMessages) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User Not Accepting Messages',
                },
                { status: 403 }
            );
        }

        const newMessage = { content, rating, createdAt: new Date() };
        user.messages.push(newMessage as Message);
        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Message Sent Successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        console.log('Error Sending Message: ', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error Sending Message',
            },
            { status: 500 }
        );
    }
};
