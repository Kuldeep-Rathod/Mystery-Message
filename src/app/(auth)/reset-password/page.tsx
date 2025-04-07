'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { signInSchema } from '@/schemas/signInSchema';
import { signIn } from 'next-auth/react';
import { resetPasswordSchema } from '@/schemas/resetPasswordSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/apiResponse';

const SignInPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    //zod implementation
    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            username: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
        setIsSubmitting(true);

        try {
            const response = await axios.post<ApiResponse>(
                '/api/reset-password',
                data
            );

            toast.success(response.data.message);
        } catch (error) {
            console.error('Error in signup user', error);

            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;
            toast.error('Failed to send Reset Link', {
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='flex justify-center  items-center min-h-screen bg-gray-800'>
            {/* Background gradient */}
            <div className='absolute flex justify-center items-center inset-0 bg-gradient-to-b from-purple-900/20 to-black/80'>
                <div className='w-full max-w-md m-4 p-4 sm:p-8 space-y-8 bg-white rounded-lg shadow-md'>
                    <div className='text-center'>
                        <h1 className='text-2xl font-bold sm:font-extrabold tracking-tight sm:text-3xl lg:text-4xl mb-6'>
                            Reset Your Password
                        </h1>
                        <p className='mb-4 text-sm sm:text-lg'>
                            Enter your email to receive a reset link
                        </p>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-6'
                        >
                            <FormField
                                name='username'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter your username here'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type='submit'
                                disabled={isSubmitting}
                                className='flex mx-auto w-full'
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader className='mr-2 h-4 w-4 animate-spin' />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className='text-center mt-4'>
                        <p className='text-sm'>
                            Remembered your password?{' '}
                            <Link
                                href='/sign-in'
                                className='text-blue-600 hover:text-blue-800'
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
