import React, { useCallback, useEffect, useState } from 'react';
import { Switch } from '../ui/switch';
import { acceptMessagesSchema } from '@/schemas/acceptMessagesSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/apiResponse';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

const AcceptMsgToggle = () => {
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);

    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessagesSchema),
    });

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');

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

    useEffect(() => {
        if (!session || !session.user) return;

        fetchAcceptMessages();
    }, [session, fetchAcceptMessages, setValue]);

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

    return (
        <>
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
        </>
    );
};

export default AcceptMsgToggle;
