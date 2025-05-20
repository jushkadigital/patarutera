'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header className={cn(isHome ? 'h-0 overflow-visible' : '')}>
      <Navbar />
    </header>
  );
}; 