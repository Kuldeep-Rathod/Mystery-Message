'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

interface AppProps {
    children: React.ReactNode;
}

export default function AuthProvider({ children }: AppProps) {
    return <SessionProvider>{children}</SessionProvider>;
}
