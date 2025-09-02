'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Destination } from '@/cms-types';

interface Props {
  destinations: Destination[]
  socialNetworks: any[]
  email: string
}

export const Header = ({ destinations, socialNetworks, email }: Props) => {
  const allowedPaths = ['/', '/destino']
  const pathname = usePathname();
  const isHome = pathname == '/'
  const isTransparent = allowedPaths.includes(pathname);

  return (
    <header className={cn(isHome ? 'h-0 overflow-visible ' : '')}>
      <Navbar destinations={destinations} isHome={isHome} isTransparent={isTransparent} socialNetworks={socialNetworks} email={email} />
    </header>
  );
}; 
