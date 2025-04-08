'use client';

import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
    const { data: session } = useSession();

    const user: User = session?.user as User;

    return (
        <nav className='p-1 md:p-2 shadow-md bg-gray-900 text-white border-b'>
            <div className='container mx-auto flex md:flex-row justify-between items-center'>
                <Link
                    href='/'
                    className='text-lg sm:text-xl font-bold md:mb-0'
                >
                    <Image
                        src={`/logo.png`}
                        alt={'logo'}
                        width='64'
                        height='32'
                    />
                </Link>
                {session ? (
                    <>
                        {' '}
                        <Link href={'/dashboard'}>
                            <span className='mr-4'>
                                Wlcome, {user.username || user.email}
                            </span>
                        </Link>
                        <Button
                            onClick={() => signOut()}
                            className=' md:w-auto bg-slate-100 text-black'
                            variant='outline'
                        >
                            Logout
                        </Button>
                    </>
                ) : (
                    <Link href={'/sign-in'}>
                        <Button className='border bg-gray-900 hover:bg-gray-500 hover:border'>
                            Login
                        </Button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
