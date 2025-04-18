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

const SignInPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    //zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await signIn('credentials', {
                redirect: false,
                identifier: data.identifier,
                password: data.password,
            });

            if (response?.error) {
                toast.error(response.error);
                setIsSubmitting(false);
                return;
            }

            if (response?.ok) {
                toast.success('Sign in successful');
                router.replace('/dashboard');
            }
        } catch (error) {
            console.error('Sign in error:', error);
            toast.error('An unexpected error occurred');
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
                            Welcome back True Feedback
                        </h1>
                        <p className='mb-4 text-sm sm:text-lg'>
                            Sign in to start your anonymous adventure
                        </p>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-6'
                        >
                            <FormField
                                name='identifier'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username/Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Username/Email'
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

                            <p className='text-sm flex gap-1 justify-end w-full'>
                                <Link
                                    href={'/reset-password'}
                                    className='text-blue-600 hover:text-blue-800'
                                >
                                    Forgot Password?
                                </Link>
                            </p>
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
                            You don&apos;t have an account?{' '}
                            <Link
                                href='/sign-up'
                                className='text-blue-600 hover:text-blue-800'
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
