'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
import { newPasswordSchema } from '@/schemas/newPasswordSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/apiResponse';

const SetNewPasswordPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const params = useParams<{ resetToken: string }>();

    const resetToken = params.resetToken;

    // Initialize the form
    const form = useForm<z.infer<typeof newPasswordSchema>>({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof newPasswordSchema>) => {
        setIsSubmitting(true);

        try {
            // Call your API endpoint to reset the password
            const response = await axios.post<ApiResponse>(
                `/api/reset-password/${resetToken}`,
                {
                    resetToken: resetToken,
                    newPass: data.password,
                    confirmNewPass: data.confirmPassword,
                }
            );

            toast.success('Password reset successfully');
            router.replace('/sign-in');
        } catch (error) {
            console.error('Password reset error:', error);

            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;

            toast.error('SignUp Failed', {
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-800'>
            <div className='absolute flex justify-center items-center inset-0 bg-gradient-to-b from-purple-900/20 to-black/80'>
                <div className='w-full max-w-md m-4 p-4 sm:p-8 space-y-8 bg-white rounded-lg shadow-md'>
                    <div className='text-center'>
                        <h1 className='text-2xl font-bold sm:font-extrabold tracking-tight sm:text-3xl lg:text-4xl mb-6'>
                            Set New Password
                        </h1>
                        <p className='mb-4 text-sm sm:text-lg'>
                            Enter your new password below
                        </p>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-6'
                        >
                            <FormField
                                name='password'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='password'
                                                placeholder='Enter new password'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name='confirmPassword'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='password'
                                                placeholder='Confirm new password'
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
                                        Updating...
                                    </>
                                ) : (
                                    'Reset Password'
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

export default SetNewPasswordPage;
