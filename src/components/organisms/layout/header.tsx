'use client';

import React from 'react';
import Link from 'next/link';
import { NavItem } from '@/components/atoms/nav-item';
import { Button, Menu, MenuItem } from '@mui/material';

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          MENU
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem>
            <NavItem href="/">Dashboard</NavItem>
          </MenuItem>
          <MenuItem>
            <NavItem href="/about">About</NavItem>
          </MenuItem>
        </Menu>
      </nav>
    </header>
  );
}
