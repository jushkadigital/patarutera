'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Destination } from '@/cms-types';

interface Props {
  destinations: Destination[]
}

export const Header = ({destinations}:Props) => {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header className={cn(isHome ? 'h-0 overflow-visible ' : '')}>
      <Navbar destinations={destinations} isHome={isHome}/>
    </header>
  );
}; 