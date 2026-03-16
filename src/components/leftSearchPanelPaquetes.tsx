"use client";

import * as React from "react";
import { Search, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Destination } from "@/cms-types";
import { parseAsArrayOf, useQueryState, parseAsString } from "nuqs";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { useSharedState } from "@/hooks/sharedContextDestinos";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useMobile } from "@/hooks/useMobile";
import { FilterLoadingOverlay } from "@/components/filter-loading-overlay";
import { Input } from "@/components/ui/input";

// Interfaz actualizada: ya no necesita 'categories'
interface LeftPanelSearchProps {
  destinations: Destination[];
}

// Componente principal: Se elimina TourCategoryList
export function LeftPanelSearchPaquete({ destinations }: LeftPanelSearchProps) {
  const isMobile = useMobile({ breakpoint: 1024 });
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  return (
    <div>
      {isMobile ? (
        <div className=" absolute mt-[-25px]">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-2 w-2" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="">
              <SheetHeader>
                <SheetTitle>Filtrar Tours</SheetTitle>
              </SheetHeader>
              <div className="mt-6 overflow-y-auto">
                <div className="flex flex-col w-full space-y-10 p-4">
                  <MultiDestinationSearch destinations={destinations} />
                  <PriceFilter />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        <div>
          <div className="flex flex-col w-full space-y-10 p-4">
            <MultiDestinationSearch destinations={destinations} />
            <PriceFilter />
          </div>
        </div>
      )}
    </div>
  );
}

interface MultiDestinationSearchProps {
  destinations: Destination[];
}

// Componente de búsqueda modificado para múltiples destinos
function MultiDestinationSearch({ destinations }: MultiDestinationSearchProps) {
  const [isPending, startTransition] = React.useTransition();

  const [selectedDestinations, setSelectedDestinations] = useQueryState(
    "filterDestination",
    parseAsArrayOf(parseAsString).withOptions({
      shallow: false,
      startTransition,
    }),
  );

  const currentDestinations = selectedDestinations ?? [];
  const firstSelectedDestination = currentDestinations[0] ?? "";
  const [searchTerm, setSearchTerm] = React.useState(firstSelectedDestination);

  React.useEffect(() => {
    setSearchTerm(firstSelectedDestination);
  }, [firstSelectedDestination]);

  const executeSearch = () => {
    const normalizedTerm = searchTerm.trim();

    if (!normalizedTerm) {
      setSelectedDestinations(null);
      return;
    }

    const matchedDestination = destinations.find((destination) =>
      destination.name.toLowerCase().includes(normalizedTerm.toLowerCase()),
    );

    setSelectedDestinations([matchedDestination?.name ?? normalizedTerm]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      executeSearch();
    }
  };

  return (
    <div className="w-full  bg-white rounded-2xl shadow-lg overflow-hidden">
      {isPending && <FilterLoadingOverlay label="Actualizando paquetes..." />}

      {/* Header */}
      <div className="px-6 py-6 border-b ">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-[#adadac] rounded-full"></div>
          <h1 className="text-[#2970b7] text-lg lg:text-[clamp(10.9px,1vw,20.48px)] font-semibold tracking-wide">
            BUSCAR PAQUETES
          </h1>
        </div>
      </div>

      {/* Form Fields */}
      <div className="p-6 space-y-6">
        {/* Destination Field */}
        <div className="border-b border-[#d9d9d9] pb-6">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <Search className="w-6 h-6 text-[#2970b7]" />
            </div>
            <div className="flex-1">
              <label className="block text-[#2970b7] text-lg lg:text-[clamp(10.9px,1vw,20.48px)] font-medium mb-2">
                Buscador
              </label>
              <div className="flex flex-col gap-3">
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar destino"
                  className="w-[clamp(170px,16.6vw,320px)]"
                />
                <Button
                  type="button"
                  onClick={executeSearch}
                  className="w-[clamp(170px,16.6vw,320px)] bg-[#2970b7] hover:bg-[#2970b7]/90 text-white"
                >
                  Ejecutar busqueda
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Date Field (sin cambios) */}
        <div className="pb-8">
          {/*<div className="flex items-start gap-4">
            <div className="mt-1">
              <Calendar className="w-6 h-6 text-[#79368c]" />
            </div>
            <div className="flex-1">
              <label className="block text-[#2970b7] text-lg font-medium mb-1">Desde</label>
              <p className="text-[#adadac] text-lg">día/mes/año</p>
            </div>
          </div>*/}
        </div>
      </div>
    </div>
  );
}

// El componente PriceFilter se mantiene igual, no se muestra aquí por brevedad.
// ... (pegar aquí el componente PriceFilter original sin cambios)
export function PriceFilter() {
  // ...código original del PriceFilter
  const minPrice = 0;
  const maxPrice = 1999;

  const { priceOne: priceRange, setPriceOne: setPriceRange } = useSharedState();

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl border border-[#e3e3e3] bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-[#adadac] rounded-full"></div>
        <h2 className="text-[#2970b7] text-xl font-semibold tracking-wide">
          Filtrar Precio
        </h2>
      </div>
      <div className="relative pt-4 pb-8">
        <SliderPrimitive.Root
          className="relative flex w-full touch-none select-none items-center"
          value={priceRange}
          onValueChange={setPriceRange as (value: number[]) => void}
          min={minPrice}
          max={maxPrice}
          step={10}
          minStepsBetweenThumbs={10}
        >
          {/* Gray track with yellow range */}
          <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-gray-300">
            {/* Only the selected range is yellow */}
            <SliderPrimitive.Range className="absolute h-full bg-[#efba06]" />
          </SliderPrimitive.Track>

          {/* Left thumb (draggable) */}
          <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full bg-[#efba06] border-2 border-[#efba06] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#efba06] focus-visible:ring-opacity-50 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 cursor-pointer shadow-lg" />

          {/* Right thumb (draggable) */}
          <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full bg-[#efba06] border-2 border-[#efba06] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#efba06] focus-visible:ring-opacity-50 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 cursor-pointer shadow-lg" />
        </SliderPrimitive.Root>
      </div>

      {/* Price Labels - now showing selected values */}
      <div className="flex justify-between mt-2">
        <span className="text-[#8d8d8d] text-lg">S/.{priceRange[0]}</span>
        <span className="text-[#8d8d8d] text-lg">S/.{priceRange[1]}</span>
      </div>

      {/* Current Range Display */}
      <div className="text-center mt-4">
        <span className="text-[#2970b7] text-sm">
          Rango: S/.{priceRange[0]} - S/.{priceRange[1]}
        </span>
      </div>
    </div>
  );
}
