import { Copy, LinkIcon } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

const CopyUrlSection = () => {
    const { data: session } = useSession();

    if (!session || !session.user) {
        return (
            <div className='flex items-center justify-center min-h-screen text-xl'>
                Please Login
            </div>
        );
    }

    const { username } = session.user;
    const baseUrl =
        typeof window !== 'undefined'
            ? `${window.location.protocol}//${window.location.host}`
            : '';
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success('URL Copied!', {
            description: 'Profile URL has been copied to clipboard.',
        });
    };

    return (
        <>
            {/* Profile URL Section */}
            <div className='rounded-lg bg-gray-700/50 p-4 backdrop-blur-sm'>
                <h2 className='mb-3 text-lg font-semibold'>Your Unique Link</h2>
                <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                    <div className='relative flex-1'>
                        <LinkIcon className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                        <input
                            type='text'
                            value={profileUrl}
                            disabled
                            className='w-full rounded-lg border border-gray-700 bg-gray-900/50 py-2 pl-10 pr-4 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-base'
                        />
                    </div>
                    <Button
                        onClick={copyToClipboard}
                        className='flex items-center gap-2 bg-purple-500 hover:bg-purple-600'
                    >
                        <Copy className='h-4 w-4' />
                        <span>Copy</span>
                    </Button>
                </div>
            </div>
        </>
    );
};

export default CopyUrlSection;
