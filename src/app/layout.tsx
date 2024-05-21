import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/organisms/layout/header';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/redux/Provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bills dashboard',
  description: 'Frontend Engineer Assessment built by Milos Lekovic',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <div className="grid min-h-screen w-full">
            <div className="flex flex-col">
              <Header />
              {children}
              <Toaster />
            </div>
          </div>
        </body>
      </Providers>
    </html>
  );
}
