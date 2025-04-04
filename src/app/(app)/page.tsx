import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { TextSearch, Mail, LinkIcon, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const HeroPage = () => {
    return (
        <div className='min-h-screen bg-gray-900'>
            {/* Hero Section */}
            <section className='relative h-screen w-full overflow-hidden px-4 sm:px-6 lg:px-8'>
                <div className='mx-auto flex h-full max-w-7xl flex-col justify-center'>
                    <div className='relative z-10 space-y-8'>
                        <h1 className='text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl lg:w-2/3'>
                            Get <span className='text-purple-400'>Honest</span>{' '}
                            Feedback{' '}
                            <span className='text-purple-400'>Anonymously</span>
                        </h1>

                        <p className='max-w-2xl text-lg text-gray-300 sm:text-xl'>
                            Message Mystery lets you receive completely
                            anonymous messages from friends, coworkers, or
                            followers. Discover what people really think - no
                            names, no fear.
                        </p>

                        <div className='flex flex-col gap-4 sm:flex-row'>
                            <Link href='/sign-up'>
                                <Button className='gap-2 bg-purple-600 px-6 py-6 text-lg hover:bg-purple-700'>
                                    Create Your Link
                                    <ArrowRight className='h-5 w-5' />
                                </Button>
                            </Link>
                            <Button
                                variant='outline'
                                className='border-white px-6 py-6 text-lg w-fit hover:bg-gray-800 hover:text-white'
                            >
                                How It Works
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Background gradient */}
                <div className='absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black/80'></div>
            </section>

            {/* How It Works Section */}
            <section className='relative bg-gray-800 py-20'>
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    <h2 className='mb-16 text-center text-3xl font-bold text-white sm:text-4xl'>
                        How It Works
                    </h2>

                    <div className='grid gap-8 md:grid-cols-3'>
                        <Card className='group border-gray-600 bg-gray-700 transition-all hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10'>
                            <CardHeader className='flex flex-col items-center space-y-4 text-center'>
                                <div className='rounded-full bg-gray-600 p-4 group-hover:bg-purple-500/10'>
                                    <LinkIcon className='h-8 w-8 text-purple-400' />
                                </div>
                                <CardTitle className='text-2xl text-white'>
                                    Create Your Link
                                </CardTitle>
                                <CardDescription className='text-gray-300'>
                                    Sign up to get your unique Message Mystery
                                    URL to share with others
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className='group border-gray-600 bg-gray-700 transition-all hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10'>
                            <CardHeader className='flex flex-col items-center space-y-4 text-center'>
                                <div className='rounded-full bg-gray-600 p-4 group-hover:bg-purple-500/10'>
                                    <Mail className='h-8 w-8 text-purple-400' />
                                </div>
                                <CardTitle className='text-2xl text-white'>
                                    Receive Messages
                                </CardTitle>
                                <CardDescription className='text-gray-300'>
                                    People visit your link and send messages
                                    completely anonymously
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className='group border-gray-600 bg-gray-700 transition-all hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10'>
                            <CardHeader className='flex flex-col items-center space-y-4 text-center'>
                                <div className='rounded-full bg-gray-600 p-4 group-hover:bg-purple-500/10'>
                                    <TextSearch className='h-8 w-8 text-purple-400' />
                                </div>
                                <CardTitle className='text-2xl text-white'>
                                    Discover Feedback
                                </CardTitle>
                                <CardDescription className='text-gray-300'>
                                    Read what people really think without
                                    knowing who sent it
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HeroPage;
