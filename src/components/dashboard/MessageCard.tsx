'use client';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import axios from 'axios';
import { ApiResponse } from '@/types/apiResponse';
import { toast } from 'sonner';
import { Message } from '@/model/User.model';
import { formatDistanceToNow } from 'date-fns';
import { Rating } from '@mui/material';

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const handleDeleteConfirm = async () => {
        const response = await axios.delete<ApiResponse>(
            `/api/delete-message/${message._id}`
        );

        toast.success(response.data.message);
        onMessageDelete(message._id as string);
    };

    const createdTimeAgo = formatDistanceToNow(new Date(message.createdAt), {
        addSuffix: true,
    });

    return (
        <Card className=' bg-gray-800 text-white p-4 flex flex-col justify-between shadow-lg rounded-xl border border-gray-700'>
            <CardHeader className='p-0 mb-2 flex flex-col gap-2 items-stretch'>
                <div className='flex justify-between items-start'>
                    <CardTitle className='text-lg font-semibold'>
                        {message.content}
                    </CardTitle>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant='destructive'
                                size='icon'
                                className='w-8 h-8'
                            >
                                <X className='w-4 h-4' />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete this message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteConfirm}
                                >
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                {/* Star rating (optional logic) */}
                <div className='flex items-center '>
                    <Rating
                        name='half-rating-read'
                        defaultValue={message.rating}
                        precision={0.5}
                        readOnly
                    />
                </div>

                <CardDescription className='text-sm text-gray-400'>
                    {createdTimeAgo}
                </CardDescription>
            </CardHeader>
        </Card>
    );
};

export { MessageCard };
