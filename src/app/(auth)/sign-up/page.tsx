'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '@/schemas/signupSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/apiResponse';
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
import { Loader, LoaderCircle } from 'lucide-react';
import Link from 'next/link';

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debounced = useDebounceCallback(setUsername, 500);
    const router = useRouter();

    //zod implementation
    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axios.get(
                        `/api/check-uname-unique?username=${username}`
                    );
                    console.log(response);
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ??
                            'Error Checking Username'
                    );
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUsernameUnique();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>(
                '/api/sign-up',
                data
            );
            toast.success(response.data.message);
            router.replace(`/verify/${username}`);
        } catch (error) {
            console.error('Error in signup user', error);

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
        <div className='flex justify-center p-4 items-center min-h-screen bg-gray-800'>
            {/* Background gradient */}
            <div className='absolute flex justify-center items-center inset-0 bg-gradient-to-b from-purple-900/20 to-black/80'>
                <div className='w-full max-w-md m-4 p-4 sm:p-8 space-y-8 bg-white rounded-lg shadow-md'>
                    <div className='text-center'>
                        <h1 className='text-2xl font-bold sm:font-extrabold tracking-tight sm:text-3xl lg:text-4xl mb-6'>
                            Join True Feedback
                        </h1>
                        <p className='mb-4 text-sm sm:text-lg'>
                            Sign up to start your anonymous adventure
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
                                                placeholder='Username'
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    debounced(e.target.value);
                                                }}
                                            />
                                        </FormControl>
                                        {isCheckingUsername && (
                                            <LoaderCircle className='animate-spin' />
                                        )}
                                        <p
                                            className={`text-sm ${
                                                usernameMessage ===
                                                'Username is available'
                                                    ? 'text-green-500'
                                                    : 'text-red-500'
                                            }`}
                                        >
                                            {usernameMessage}
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name='email'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Email'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name='password'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='password'
                                                placeholder='Password'
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
                                className='flex mx-auto'
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader className='mx-4 animate-spin' />
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        </form>
                    </Form>
                    <div className='text-center mt-4'>
                        <p>
                            Already a member?{' '}
                            <Link
                                href='/sign-in'
                                className='text-blue-600 hover:text-blue-800'
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
