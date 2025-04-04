'use client';

import { Button } from '@/components/ui/button';
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    Form,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { messageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/apiResponse';

const PublicLink = () => {
    const params = useParams<{ username: string }>();

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        try {
            const response = await axios.post('/api/send-message', {
                username: params.username,
                content: data.content,
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
        <div className='flex flex-col justify-center items-center w-full my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded'>
            <div className='mb-4 w-full flex flex-col justify-center items-center'>
                <h1 className='text-4xl font-bold mb-4'>Public Profile Link</h1>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='w-2/3 flex flex-col justify-center  space-y-6'
                    >
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
    );
};

export default PublicLink;
