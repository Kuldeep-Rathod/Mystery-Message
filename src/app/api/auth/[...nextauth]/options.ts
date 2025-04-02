import type { NextAuthConfig } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import UserModel from '@/model/User.model';

export const authOptions: NextAuthConfig = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ],
                    });

                    if (!user) {
                        throw new Error('User not found');
                    }
                    if (!user.isVerified) {
                        throw new Error('Verify Your Email');
                    }

                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error('Incorrect Password');
                    }
                } catch (error: any) {
                    throw new Error(error);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessages =
                    token.isAcceptingMessages as boolean;
                session.user.username = token.username as string;
            }

            return session;
        },
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
