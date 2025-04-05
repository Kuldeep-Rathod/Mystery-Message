'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const VerifyCodePage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const params = useParams<{ username: string }>();

    //zod implementation
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/verify-code', {
                username: params.username,
                code: data.code,
            });
            toast.success(response.data.message);
            router.replace(`/sign-in`);
        } catch (error) {
            console.error('Error in signup user', error);

            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;
            toast.error('SignUp Failed', {
                description: errorMessage,
            });
            // router.replace(`/sign-up`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const onResend = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/resend-code', {
                username: params.username,
            });
            toast.success(response.data.message);
            // router.replace(`/sign-in`);
        } catch (error) {
            console.error('Error in send code', error);

            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;
            toast.error('SignUp Failed', {
                description: errorMessage,
            });
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-800'>
            {/* Background gradient */}
            <div className='absolute flex justify-center items-center inset-0 bg-gradient-to-b from-purple-900/20 to-black/80'>
                <div className='w-full max-w-md flex flex-col justify-center items-center m-4 p-4 sm:p-8 space-y-8 bg-white rounded-lg shadow-md'>
                    <div className='text-center'>
                        <h1 className='text-2xl font-bold sm:font-extrabold tracking-tight sm:text-3xl lg:text-4xl mb-6'>
                            Verify Your Account
                        </h1>
                        <p className='text-sm sm:text-lg'>
                            Enter the verification code sent to your email
                        </p>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='w-full space-y-6 flex flex-col items-center'
                        >
                            <FormField
                                control={form.control}
                                name='code'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='mx-auto'>
                                            One-Time Password
                                        </FormLabel>
                                        <FormControl>
                                            <InputOTP
                                                maxLength={6}
                                                {...field}
                                            >
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <p className='text-sm flex gap-1 justify-center w-full'>
                                Didn&apos;t get code?{' '}
                                <span
                                    onClick={onResend}
                                    className='text-blue-800'
                                >
                                    Resend
                                </span>
                            </p>

                            <div className='flex w-full gap-4 justify-between sm:justify-around'>
                                <Link href={'/sign-up'}>
                                    <Button className='mx-auto bg-white border text-black hover:bg-gray-200'>
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type='submit'
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader className=' animate-spin' />
                                        </>
                                    ) : (
                                        'Submit'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default VerifyCodePage;
