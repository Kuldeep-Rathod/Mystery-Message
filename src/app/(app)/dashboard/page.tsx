'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/model/User.model';
import { acceptMessagesSchema } from '@/schemas/acceptMessagesSchema';
import { ApiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import {
    Loader2,
    RefreshCcw,
    Copy,
    Link as LinkIcon,
    Mail,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const UserDashboard = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);

    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessagesSchema),
    });

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    };

    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>(
                '/api/accept-messages'
            );
            setValue(
                'acceptMessages',
                response.data.isAcceptingMessages || false
            );
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error('Error', {
                description:
                    axiosError.response?.data.message ??
                    'Failed to fetch message settings',
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue]);

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
        fetchAcceptMessages();
    }, [session, fetchMessages, fetchAcceptMessages, setValue]);

    const handleSwitchChange = async () => {
        try {
            await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages,
            });
            setValue('acceptMessages', !acceptMessages);
            toast.success(
                `Messages are now ${!acceptMessages ? 'accepted' : 'not accepted'}`
            );
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error('Error', {
                description:
                    axiosError.response?.data.message ??
                    'Failed to update message settings',
            });
        }
    };

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

                        {/* Profile URL Section */}
                        <div className='rounded-lg bg-gray-700/50 p-4 backdrop-blur-sm'>
                            <h2 className='mb-3 text-lg font-semibold'>
                                Your Unique Link
                            </h2>
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

                        {/* Message Acceptance Toggle */}
                        <div className='flex items-center justify-between rounded-lg bg-gray-700/50 p-4 backdrop-blur-sm'>
                            <div>
                                <h3 className='font-medium'>Accept Messages</h3>
                                <p className='text-sm text-gray-400'>
                                    {acceptMessages
                                        ? 'Your link is active'
                                        : 'Your link is inactive'}
                                </p>
                            </div>
                            <Switch
                                {...register('acceptMessages')}
                                checked={acceptMessages}
                                onCheckedChange={handleSwitchChange}
                                disabled={isSwitchLoading}
                                className='data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-gray-600'
                            />
                        </div>

                        <Separator className='bg-gray-700' />

                        {/* Messages Section */}
                        <div className='space-y-4 text-white'>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-xl font-semibold'>
                                    Your Messages
                                </h2>
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
                                    <span className='hidden sm:inline'>
                                        Refresh
                                    </span>
                                </Button>
                            </div>

                            {messages.length > 0 ? (
                                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                                    {messages.map((message) => (
                                        <MessageCard
                                            key={message._id as string}
                                            message={message}
                                            onMessageDelete={
                                                handleDeleteMessage
                                            }
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className='flex flex-col items-center justify-center rounded-lg bg-gray-700/50 p-8 text-center backdrop-blur-sm'>
                                    <Mail className='mb-4 h-12 w-12 text-gray-400' />
                                    <h3 className='text-lg font-medium'>
                                        No messages yet
                                    </h3>
                                    <p className='text-gray-400'>
                                        Share your link to receive anonymous
                                        messages
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
