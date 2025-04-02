import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, User } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import UserModel from '@/model/User.model';

export const POST = async (req: NextRequest) => {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return NextResponse.json(
            {
                success: false,
                message: 'Not Authenticated',
            },
            { status: 401 }
        );
    }

    const userId = user._id;
    const { acceptMessages } = await req.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessages: acceptMessages,
            },
            { new: true }
        );
        if (!updatedUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed To update message acceptance status',
                },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: 'Updated User Message Acceptance Successfully',
                updatedUser,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log('Failed To update message acceptance status', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed To update message acceptance status',
            },
            { status: 500 }
        );
    }
};

export const GET = async (req: NextRequest) => {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return NextResponse.json(
            {
                success: false,
                message: 'Not Authenticated',
            },
            { status: 401 }
        );
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);

        if (!foundUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User Not Found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages,
        });
    } catch (error) {
        console.log('Failed To update message acceptance status', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed To Get message acceptance status',
            },
            { status: 500 }
        );
    }
};
