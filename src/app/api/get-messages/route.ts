import dbConnect from '@/lib/dbConnect';
import { getServerSession, User } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/options';
import mongoose from 'mongoose';
import UserModel from '@/model/User.model';

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

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ]);
        if (!user || user.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No Messages yet',
                },
                { status: 404 }
            );
        }
        return NextResponse.json(
            {
                success: true,
                messages: user[0].messages,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log('Unexpected error to get messages', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error',
            },
            { status: 500 }
        );
    }
};
