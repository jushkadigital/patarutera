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
  NavigationMenuTrigger,
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
import { NavigationMenuContent } from '@radix-ui/react-navigation-menu';

// Asume que tienes un logo en esta ruta, o reemplázalo
const LOGO_URL = '/pataruteraLogoWhite.svg'; // Reemplaza con la ruta real de tu logo
const LOGO_URLCOLOR = '/pataruteraLogo.svg'; // Reemplaza con la ruta real de tu logo
interface Props {
  destinations: Destination[]
  isHome: boolean
}
export const Navbar = ({destinations,isHome}:Props) => {
  //const pathname = usePathname();
  //const isHome = pathname === '/';

  const navbarClasses = cn(
    'w-full transition-all duration-300 ease-in-out z-50',
    isHome
      ? 'bg-transparent text-white absolute top-0 left-0 py-6'
      : 'bg-background text-foreground shadow-sm sticky top-0 py-4',
  );


  console.log(destinations)

  return (
    <nav className={navbarClasses}>
      <div className=" mx-auto flex items-center justify-between px-4">
        {/* Sección 1: Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src={isHome ? LOGO_URL: LOGO_URLCOLOR} alt="Logo" width={100} height={100} className={cn(isHome ? '' : '')} />
        </Link>

        {/* Secciones 2, 3, 4: Navegación Principal y Dropdown */}
        <NavigationMenu className="md:flex" >
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className={cn(navigationMenuTriggerStyle(), isHome ? 'bg-transparent hover:bg-white/10 text-white' : 'text-[#2970b7]')}>Destinos</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[250px]">
                  {
                    destinations.map(ele=>(
                      <ListItem
                  key={ele.name}
                  title={""}
                  href={`/destinos?destination=${ele.name}&categories=`}
                >
                  {ele.name}
                </ListItem>
             
            ))

                  }
                  </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {/* Sección 2: Enlace 1 */}
            <NavigationMenuItem>
                <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), isHome ? 'bg-transparent hover:bg-white/10 text-white' : 'text-[#2970b7]')}>
              <Link href="/paquetes?destinations=Ica,Cusco" >
                  Paquetes
              </Link>
                </NavigationMenuLink>
            </NavigationMenuItem>


            {/* Sección 4: Enlace 2 */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), isHome ? 'bg-transparent hover:bg-white/10 text-white' : 'text-[#2970b7]')}>
              <Link href="/blogs" >
                Blog
              </Link>
                </NavigationMenuLink>
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

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}