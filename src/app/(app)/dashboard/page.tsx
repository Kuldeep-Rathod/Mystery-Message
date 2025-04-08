'use client';

import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';
import CopyUrlSection from '@/components/dashboard/CopyURL';
import MessageSection from '@/components/dashboard/MessageSection';
import MsgStatististics from '@/components/dashboard/MsgStatististics';

const UserDashboard = () => {
    const { data: session } = useSession();

    if (!session || !session.user) {
        return (
            <div className='flex items-center justify-center min-h-screen text-xl'>
                Please Login
            </div>
        );
    }

    return (
        <div className='bg-gray-900'>
            <div className='min-h-screen bg-gradient-to-b from-purple-900/20 to-black/80 text-white'>
                <div className='container mx-auto px-4 py-8 sm:px-6 lg:px-8'>
                    <div className='space-y-6'>
                        {/* Header Section */}
                        <div className='space-y-2'>
                            <h1 className='text-3xl font-bold sm:text-4xl'>
                                User Dashboard
                            </h1>
                            <p className='text-gray-300'>
                                Manage your anonymous messages
                            </p>
                        </div>

                        <MsgStatististics />
                        <CopyUrlSection />
                        <Separator className='bg-gray-700' />
                        <MessageSection />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
