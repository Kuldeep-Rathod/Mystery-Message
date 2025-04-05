'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { z } from 'zod';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star'; // Use MUI icon here
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from '@/components/ui/form';
import { messageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/apiResponse';
import { grey } from '@mui/material/colors';

const labels: Record<number, string> = {
    0.5: 'Useless',
    1: 'Terrible',
    1.5: 'Bad',
    2: 'Poor',
    2.5: 'Ok',
    3: 'Average',
    3.5: 'Good',
    4: 'Very good',
    4.5: 'Excellent',
    5: 'Perfect',
};

const getLabelText = (value: number) =>
    `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;

const PublicLink = () => {
    const params = useParams<{ username: string }>();
    const [hover, setHover] = useState(-1);

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: '',
            rating: 0,
        },
    });

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        try {
            const response = await axios.post('/api/send-message', {
                username: params.username,
                content: data.content,
                rating: data.rating,
            });
            toast.success(response.data.message);
            form.reset();
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(
                axiosError.response?.data.message || 'Failed to send message'
            );
        }
    };

    return (
        <div className='bg-gray-900 min-h-screen text-white'>
            <div className='absolute inset-0 bg-gradient-to-b from-purple-900/30 to-black/80'>
                <div className='mb-4 py-12 w-full flex flex-col justify-center items-center'>
                    <h1 className='text-4xl font-bold mb-4'>
                        Public Profile Link
                    </h1>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='w-2/3 flex flex-col justify-center space-y-6'
                        >
                            {/* Message Field */}
                            <FormField
                                name='content'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Send Anonymous message to @
                                            {params.username}
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder='Tell us a little bit about yourself'
                                                className='resize-none'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            You can <span>@mention</span> other
                                            users and organizations.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Rating Field with Labels */}
                            <FormField
                                name='rating'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rating</FormLabel>
                                        <FormControl>
                                            <div>
                                                <Rating
                                                    name='hover-feedback'
                                                    value={field.value}
                                                    precision={0.5}
                                                    getLabelText={getLabelText}
                                                    onChange={(_, newValue) =>
                                                        field.onChange(newValue)
                                                    }
                                                    onChangeActive={(
                                                        _,
                                                        newHover
                                                    ) => setHover(newHover)}
                                                    emptyIcon={
                                                        <StarIcon
                                                            className='text-white'
                                                            style={{
                                                                opacity: 0.5,
                                                            }}
                                                            fontSize='inherit'
                                                        />
                                                    }
                                                />
                                                {field.value !== null && (
                                                    <Box sx={{ ml: 2 }}>
                                                        {
                                                            labels[
                                                                hover !== -1
                                                                    ? hover
                                                                    : field.value
                                                            ]
                                                        }
                                                    </Box>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type='submit'
                                className='w-fit'
                            >
                                Submit
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default PublicLink;
