'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Destination } from '@/cms-types';

// Asume que tienes un logo en esta ruta, o reemplázalo
const LOGO_URL = '/pataruteraLogoWhite.svg'; // Reemplaza con la ruta real de tu logo
const LOGO_URLCOLOR = '/pataruteraLogo.svg'; // Reemplaza con la ruta real de tu logo
interface Props {
  destinations: Destination[]
}
export const Navbar = ({destinations}:Props) => {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const navbarClasses = cn(
    'w-full transition-all duration-300 ease-in-out z-50',
    isHome
      ? 'bg-transparent text-white absolute top-0 left-0 py-6'
      : 'bg-background text-foreground shadow-sm sticky top-0 py-4',
  );


  console.log(destinations)

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Sección 1: Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src={isHome ? LOGO_URL: LOGO_URLCOLOR} alt="Logo" width={100} height={100} className={cn(isHome ? '' : '')} />
        </Link>

        {/* Secciones 2, 3, 4: Navegación Principal y Dropdown */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>

            
            
            {/* Sección 3: Menú Desplegable */}
            <NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={isHome ? "ghost" : "ghost"} className={cn(navigationMenuTriggerStyle(), isHome ? 'bg-transparent hover:bg-white/10 text-white' : 'text-[#2970b7]')}>
                    Destinos
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
              {destinations.map(ele=>(
              <DropdownMenuItem asChild>
                <Link href={`/destinos?city=${ele.name}`} passHref>
                  {ele.name}
              </Link>
              </DropdownMenuItem>
            ))}
            </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
            {/* Sección 2: Enlace 1 */}
            <NavigationMenuItem>
              <Link href="/productos" passHref>
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), isHome ? 'bg-transparent hover:bg-white/10 text-white' : 'text-[#2970b7]')}>
                  Paquetes
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>


            {/* Sección 4: Enlace 2 */}
            <NavigationMenuItem>
              <Link href="/blog"  passHref>
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), isHome ? 'bg-transparent hover:bg-white/10 text-white' : 'text-[#2970b7]')}>
                  Blog
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Sección 5: Botón CTA */}
        <Button variant={isHome ? "outline" : "default"} className={cn(isHome ? ' border-white text-white hover:bg-white hover:text-primary' : '','bg-transparent')}>
        </Button>

        {/* Placeholder para menú móvil si es necesario */}
        {/* <div className="md:hidden">...</div> */}
      </div>
    </nav>
  );
}; 