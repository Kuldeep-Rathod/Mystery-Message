import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User.model';
import { getServerSession, User } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/options';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
    dbConnect();

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
        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'User ID not provided' },
                { status: 400 }
            );
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Calculate date ranges
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeekAgo = new Date(
            oneWeekAgo.getTime() - 7 * 24 * 60 * 60 * 1000
        );

        // Filter messages from this week and last week
        const currentWeekMessages = user.messages.filter(
            (message) => new Date(message.createdAt) >= oneWeekAgo
        );
        console.log('current: ', currentWeekMessages.length);

        const lastWeekMessages = user.messages.filter((message) => {
            const messageDate = new Date(message.createdAt);
            return messageDate < oneWeekAgo && messageDate >= twoWeekAgo;
        });

        console.log('last: ', lastWeekMessages.length);

        // Initialize counters
        let weeklyPositive = 0;
        let weeklyNeutral = 0;
        let weeklyNegative = 0;
        let weeklyTotal = currentWeekMessages.length;
        let totalPercentageChange = 0;

        let totalPositive = 0;
        let totalNeutral = 0;
        let totalNegative = 0;
        const total = user.messages.length;

        // Calculate percentage change from last week
        const lastWeekTotal = lastWeekMessages.length;
        const currentWeekTotal = currentWeekMessages.length;

        if (lastWeekTotal > 0) {
            totalPercentageChange = Math.floor(
                (currentWeekTotal * 100) / lastWeekTotal
            );
        } else if (total > 0) {
            totalPercentageChange = 100;
        }

        // Categorize messages based on rating
        user.messages.forEach((message) => {
            if (message.rating > 3) {
                totalPositive++;
            } else if (message.rating < 2.5) {
                totalNegative++;
            } else {
                totalNeutral++;
            }
        });

        return NextResponse.json({
            success: true,
            MessageStats: {
                total,
                totalPositive,
                totalNeutral,
                totalNegative,
                weeklyTotal,
                // Optional: percentages
                totalPercentageChange,
                positivePercentage:
                    total > 0 ? Math.floor((totalPositive / total) * 100) : 0,
                neutralPercentage:
                    total > 0 ? Math.floor((totalNeutral / total) * 100) : 0,
                negativePercentage:
                    total > 0 ? Math.floor((totalNegative / total) * 100) : 0,
            },
        });
    } catch (error) {
        console.error('Error counting messages:', error);
        return NextResponse.json(
            { success: false, message: 'Error counting messages' },
            { status: 500 }
        );
    }
}
