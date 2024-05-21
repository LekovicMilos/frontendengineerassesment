import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/organisms/layout/header';
import Providers from '@/redux/Provider';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';

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
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <div className="grid min-h-screen w-full">
                <div className="flex flex-col">
                  <Header />
                  {children}
                </div>
              </div>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </body>
      </Providers>
    </html>
  );
}
