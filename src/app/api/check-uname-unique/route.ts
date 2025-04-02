import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User.model';
import { usernameValidation } from '@/schemas/signupSchema';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export const GET = async (req: NextRequest) => {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const queryParam = { username: searchParams.get('username') };

        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        // console.log(result);
        if (!result.success) {
            const usernameError = result.error.format().username?._errors || [];
            return NextResponse.json(
                {
                    success: false,
                    message:
                        usernameError?.length > 0
                            ? usernameError.join(', ')
                            : 'Invalid query parameters',
                },
                { status: 400 }
            );
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Username is already taken',
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Username is available',
            },
            { status: 200 }
        );
    } catch (error) {
        console.log('Error in Checking Username', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error in Checking Username',
            },
            { status: 500 }
        );
    }
};
