'use client';

import * as React from 'react';
import { Calendar, ChevronsUpDown, MapPin, Search, ChevronDown, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Destination, TourCategory } from '@/cms-types';
import { parseAsArrayOf, useQueryState, parseAsString } from 'nuqs';
import * as SliderPrimitive from "@radix-ui/react-slider";
import { useSharedState } from '@/hooks/sharedContextDestinos';

// Interfaz actualizada: ya no necesita 'categories'
interface LeftPanelSearchProps {
  title?: string;
  destinations: Destination[];
}

// Componente principal: Se elimina TourCategoryList
export function LeftPanelSearchPaquete({ title, destinations }: LeftPanelSearchProps) {
  return (
    <div className='flex flex-col w-full space-y-10 p-4'>
      <MultiDestinationSearch destinations={destinations} />
      <PriceFilter />
    </div>
  );
}

interface MultiDestinationSearchProps {
  destinations: Destination[];
}

// Componente de búsqueda modificado para múltiples destinos
function MultiDestinationSearch({ destinations }: MultiDestinationSearchProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // 1. Cambiamos el estado para que acepte un array de strings
  const [selectedDestinations, setSelectedDestinations] = useQueryState(
    'destinations',
    parseAsArrayOf(parseAsString).withOptions({ shallow: false })
  );

  // 2. Estado temporal para manejar la selección antes de aplicar
  const [tempDestinations, setTempDestinations] = React.useState<string[] | null>(selectedDestinations);

  // 3. Función para añadir o quitar un destino de la selección temporal
  const handleDestinationToggle = (destinationName: string) => {
    setTempDestinations((prev) =>
      prev!.includes(destinationName)
        ? prev!.filter((d) => d !== destinationName)
        : [...prev!, destinationName]
    );
  };

  return (
    <div className="w-full  bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-6 border-b ">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-[#adadac] rounded-full"></div>
          <h1 className="text-[#2970b7] text-xl font-semibold tracking-wide">BUSCAR TOURS</h1>
        </div>
      </div>

      {/* Form Fields */}
      <div className="p-6 space-y-6">
        {/* Destination Field */}
        <div className="border-b border-[#d9d9d9] pb-6">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <MapPin className="w-6 h-6 text-[#2970b7]" />
            </div>
            <div className="flex-1">
              <label className="block text-[#2970b7] text-lg font-medium mb-2">Destino(s)</label>
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="w-full text-left text-lg bg-white border border-[#d9d9d9] rounded-lg px-3 py-2 pr-10 outline-none focus:border-[#2970b7] focus:ring-2 focus:ring-[#2970b7]/20 cursor-pointer transition-all duration-200 hover:border-[#2970b7]/50 flex items-center gap-2 relative"
                  >
                    {/* 4. Mostrar destinos seleccionados o placeholder */}
                    <div className="flex flex-wrap gap-1 items-center">
                      {tempDestinations!.length > 0 ? (
                        tempDestinations!.map(dest => (
                          <span key={dest} className="bg-[#2970b7] text-white text-sm font-medium px-2 py-1 rounded-full flex items-center gap-1">
                            {dest}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#adadac]">Seleccionar destinos</span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#adadac] transition-transform duration-200 absolute right-3 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="relative">
                  <div className="absolute top-1 left-0 right-0 bg-white border border-[#d9d9d9] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {destinations.map((destination) => (
                      <button
                        key={destination.name}
                        type="button"
                        onClick={() => handleDestinationToggle(destination.name)}
                        className="w-full text-left px-3 py-2 hover:bg-[#f5f5f5] transition-colors duration-150 flex items-center gap-3 text-[#333] first:rounded-t-lg last:rounded-b-lg"
                      >
                        {/* 5. Usar Checkbox para indicar selección */}
                        <Checkbox
                          checked={tempDestinations!.includes(destination.name)}
                          className="data-[state=checked]:bg-[#2970b7] data-[state=checked]:border-[#2970b7]"
                        />
                        <MapPin className="w-4 h-4 text-[#2970b7]" />
                        {destination.name}
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>

        {/* Date Field (sin cambios) */}
        <div className="pb-8">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <Calendar className="w-6 h-6 text-[#79368c]" />
            </div>
            <div className="flex-1">
              <label className="block text-[#2970b7] text-lg font-medium mb-1">Desde</label>
              <p className="text-[#adadac] text-lg">día/mes/año</p>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={() => {
            // 6. Aplicar la selección temporal al estado final
            setSelectedDestinations(tempDestinations);
            setIsOpen(false); // Opcional: cerrar el dropdown al buscar
          }}
          className="w-full bg-[#2970b7] text-white py-4 px-6 rounded-2xl font-medium text-lg flex items-center justify-center gap-3 hover:bg-[#2970b7]/90 transition-colors">
          Buscar
          <Search className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// El componente PriceFilter se mantiene igual, no se muestra aquí por brevedad.
// ... (pegar aquí el componente PriceFilter original sin cambios)
export function PriceFilter() {
    // ...código original del PriceFilter
 const minPrice = 0
  const maxPrice = 1999

  const {priceOne:priceRange,setPriceOne:setPriceRange} = useSharedState()

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl border border-[#e3e3e3] bg-white p-6">
      
      <div  className="flex items-center gap-3">
      <div className="w-1 h-8 bg-[#adadac] rounded-full"></div>
      <h2 className="text-[#2970b7] text-xl font-semibold tracking-wide">Filtrar Precio</h2>
      </div>
      <div className="relative pt-4 pb-8">
        <SliderPrimitive.Root
          className="relative flex w-full touch-none select-none items-center"
          value={priceRange}
          onValueChange={(setPriceRange as (value: number[])=>void)}
          min={minPrice}
          max={maxPrice}
          step={10}
          minStepsBetweenThumbs={50}
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
  )
}