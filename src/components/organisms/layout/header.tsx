'use client';

import React from 'react';
import Link from 'next/link';
import { NavItem } from '@/components/atoms/nav-item';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bars3Icon } from '@heroicons/react/20/solid';

export default function Header() {
  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:h-[60px]">
      <Link className="flex items-center gap-2 font-semibold" href="/">
        Bills dashboard
      </Link>
      <nav className="hidden items-start px-4 text-sm font-medium lg:flex">
        <NavItem href="/">Dashboard</NavItem>
        <NavItem href="/about">About</NavItem>
      </nav>
      <nav className="grid items-start px-4 text-sm font-medium lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Bars3Icon className="mr-2 h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <NavItem href="/">Dashboard</NavItem>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavItem href="/about">About</NavItem>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}
