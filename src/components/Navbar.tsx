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

// Asume que tienes un logo en esta ruta, o reemplázalo
const LOGO_URL = '/logo-placeholder.svg'; // Reemplaza con la ruta real de tu logo

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const navbarClasses = cn(
    'w-full transition-all duration-300 ease-in-out z-50',
    isHome
      ? 'bg-transparent text-white absolute top-0 left-0 py-6'
      : 'bg-background text-foreground shadow-sm sticky top-0 py-4',
  );

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Sección 1: Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src={LOGO_URL} alt="Logo" width={40} height={40} className={cn(isHome ? 'invert' : '')} />
          <span className={cn("font-semibold text-xl hidden sm:inline", isHome ? 'text-white' : 'text-foreground')}>MiEmpresa</span>
        </Link>

        {/* Secciones 2, 3, 4: Navegación Principal y Dropdown */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {/* Sección 2: Enlace 1 */}
            <NavigationMenuItem>
              <Link href="/productos" passHref>
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), isHome ? 'bg-transparent hover:bg-white/10 text-white' : '')}>
                  Productos
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* Sección 3: Menú Desplegable */}
            <NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={isHome ? "ghost" : "ghost"} className={cn("px-4 py-2", isHome ? 'hover:bg-white/10 text-white' : '')}>
                    Servicios
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem asChild>
                    <Link href="/servicios/opcion1">Opción Servicio 1</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/servicios/opcion2">Opción Servicio 2</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/servicios/opcion3">Opción Servicio 3</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>

            {/* Sección 4: Enlace 2 */}
            <NavigationMenuItem>
              <Link href="/blog" legacyBehavior passHref>
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), isHome ? 'bg-transparent hover:bg-white/10 text-white' : '')}>
                  Blog
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Sección 5: Botón CTA */}
        <Button variant={isHome ? "outline" : "default"} className={cn(isHome ? 'border-white text-white hover:bg-white hover:text-primary' : '')}>
          Contacto
        </Button>

        {/* Placeholder para menú móvil si es necesario */}
        {/* <div className="md:hidden">...</div> */}
      </div>
    </nav>
  );
}; 