import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Loader2, Mail, RefreshCcw } from 'lucide-react';
import { MessageCard } from './MessageCard';
import { Message } from '@/model/User.model';
import { ApiResponse } from '@/types/apiResponse';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

const MessageSection = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { data: session } = useSession();

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    };

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages');
            setMessages(response.data.messages || []);
            if (refresh) {
                toast.success('Refreshed Messages', {
                    description: 'Showing latest messages',
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error('Error', {
                description:
                    axiosError.response?.data.message ??
                    'Failed to fetch messages',
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!session || !session.user) return;
        fetchMessages();
    }, [session, fetchMessages]);

    return (
        <>
            {/* Messages Section */}
            <div className='space-y-4 text-white'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-semibold'>Your Messages</h2>
                    <Button
                        variant='outline'
                        onClick={() => fetchMessages(true)}
                        disabled={isLoading}
                        className='gap-2 hover:text-white border-gray-700 bg-gray-700  hover:bg-gray-800'
                    >
                        {isLoading ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                            <RefreshCcw className='h-4 w-4' />
                        )}
                        <span className='hidden sm:inline'>Refresh</span>
                    </Button>
                </div>

                {messages.length > 0 ? (
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                        {messages.map((message) => (
                            <MessageCard
                                key={message._id as string}
                                message={message}
                                onMessageDelete={handleDeleteMessage}
                            />
                        ))}
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center rounded-lg bg-gray-700/50 p-8 text-center backdrop-blur-sm'>
                        <Mail className='mb-4 h-12 w-12 text-gray-400' />
                        <h3 className='text-lg font-medium'>No messages yet</h3>
                        <p className='text-gray-400'>
                            Share your link to receive anonymous messages
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default MessageSection;
