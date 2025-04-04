import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User.model';
import { authOptions } from '../../auth/[...nextauth]/options';

export const DELETE = async (
    req: NextRequest,
    { params }: { params: Promise<{ messageid: string }> }
) => {
    const { messageid } = await params;
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json(
            { success: false, message: 'Not Authenticated' },
            { status: 401 }
        );
    }

    try {
        // Find user by email (since that's likely what's in the session)
        const user = await UserModel.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Check if message exists before attempting deletion
        const messageExists = user.messages.some(
            (msg: any) => msg._id.toString() === messageid
        );

        if (!messageExists) {
            return NextResponse.json(
                { success: false, message: 'Message not found' },
                { status: 404 }
            );
        }

        const updatedResult = await UserModel.updateOne(
            { _id: user._id, 'messages._id': messageid },
            { $pull: { messages: { _id: messageid } } }
        );

        if (updatedResult.modifiedCount === 0) {
            return NextResponse.json(
                { success: false, message: 'Failed to delete message' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Message deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting message:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
};
