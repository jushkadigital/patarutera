'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuContent
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Destination } from '@/cms-types';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

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
      <div className=" mx-auto flex items-center justify-around px-4">
        {/* Sección 1: Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src={isHome ? LOGO_URL: LOGO_URLCOLOR} alt="Logo" width={200} height={200} className={cn(isHome ? '' : '')} />
        </Link>
        <div></div>

        {/* Secciones 2, 3, 4: Navegación Principal y Dropdown */}
        <NavigationMenu className="hidden md:flex" >
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className={cn(navigationMenuTriggerStyle(), isHome ? 'bg-transparent hover:bg-white/10 text-white' : 'text-[#2970b7]')}>Destinos</NavigationMenuTrigger>
              <NavigationMenuContent className="w-full md:w-[250px]">
                <ul className="grid gap-2 p-2">
                  {
                    destinations.map(ele=>(
                      <ListItem
                  key={ele.name}
                  title={""}
                  href={`/destinos?destination=${ele.name}&categories=`}
                  isHome={isHome}
                  className=""
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

        {/* Placeholder para menú móvil si es necesario */}
         <div className="md"> </div> 
         
         {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
              <Menu size={40} className={cn("md:hidden", isHome ? "text-white hover:bg-white/10" : "text-[#2970b7] hover:bg-gray-100")}/>
          </SheetTrigger>
          <SheetContent side="left" className="w-[400px] sm:w-[400px]">
            <div className="flex flex-col space-y-4 mt-6 justify-center">
              {/* Logo en el menú móvil */}
              
              <SheetClose asChild>
              <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
                <Image src={LOGO_URLCOLOR || "/placeholder.svg"} alt="Logo" width={150} height={150} />
              </Link>
              </SheetClose>
              {/* Destinos con Collapsible */}
              <Collapsible>
                <CollapsibleTrigger  className="flex w-full items-center justify-center py-2 text-3xl font-semibold text-[#2970b7] hover:text-[#1e5a9b]">
                  Destinos
                </CollapsibleTrigger >
                <CollapsibleContent className="space-y-2 flex-col justify-center items-center">
                  {destinations?.length > 0 ? (
                    destinations.map((ele) => (
                     <SheetClose asChild>
                      <Link
                        key={ele.name}
                        href={`/destinos?destination=${ele.name}&categories=`}
                        className="block py-2 text-lg text-gray-800 hover:text-[#2970b7] transition-colors text-center"
                      >
                        {ele.name}
                      </Link>
                      </SheetClose>
                    ))
                  ) : (
                    <div className="block py-2 text-sm text-gray-500">No hay destinos disponibles</div>
                  )}
                </CollapsibleContent>
              </Collapsible>

              {/* Paquetes */}
              <SheetClose asChild>
              <Link
                href="/paquetes?destinations=Ica,Cusco"
                className="py-2 text-3xl font-semibold text-[#2970b7] hover:text-[#1e5a9b] transition-colors text-center"
              >
                Paquetes
              </Link>
              </SheetClose>
              {/* Blog */}
              <SheetClose asChild>
              <Link
                href="/blogs"
                className="py-2 text-3xl font-semibold text-[#2970b7] hover:text-[#1e5a9b] transition-colors text-center"
              >
                Blog
              </Link></SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}; 

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string , isHome: boolean}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), props.isHome ? 'bg-transparent hover:bg-white/10 text-white' : 'text-[#2970b7]')}>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground  text-lg leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}