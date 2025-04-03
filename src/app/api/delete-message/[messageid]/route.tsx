import { getServerSession, User } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User.model';
import { authOptions } from '../../auth/[...nextauth]/options';

export const DELETE = async (
    req: NextRequest,
    { params }: { params: { messageid: string } }
) => {
    const messageId = params.messageid;
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

    try {
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        );
        if (updatedResult.modifiedCount == 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Already Deleted or Not Found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Message Deleted',
            },
            { status: 200 }
        );
    } catch (error) {
        console.log('Error to Delete message', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error: Delete Message',
            },
            { status: 500 }
        );
    }
};
