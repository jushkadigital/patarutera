'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib2/utils';
import { Destination } from '@/cms-types';
import { StoreCart } from '@medusajs/types';

interface Props {
  destinations: Destination[]
  socialNetworks: any[]
  email: string
  cart: StoreCart | null
}

export const Header = ({ destinations, socialNetworks, email, cart }: Props) => {
  const allowedPaths = ['/', '/destino']
  const pathname = usePathname();
  const isHome = pathname == '/'
  const isTransparent = allowedPaths.includes(pathname);

  return (
    <header className={cn(isHome ? 'h-0 overflow-visible ' : '')}>
      <Navbar destinations={destinations} isHome={isHome} isTransparent={isTransparent} socialNetworks={socialNetworks} email={email} cart={cart} />
    </header>
  );
}; 
