'use client';

import * as React from 'react';
import { Calendar, ChevronsUpDown, MapPin, Search, ChevronDown, Tag, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label'; // Asumiendo que tienes un componente Label o usa html label
import { Destination, TourCategory } from '@/cms-types';
import {parseAsArrayOf,useQueryState,parseAsString} from 'nuqs'
import * as SliderPrimitive from "@radix-ui/react-slider"
import { useSharedState } from '@/hooks/sharedContextDestinos';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { useMobile } from '@/hooks/useMobile';
import Link from 'next/link';



interface LeftPanelSearch {
  categories: TourCategory[];
  title?: string; // Optional title for the collapsible trigger
  destinations: Destination[];
}



export function LeftPanelSearch({categories,title,destinations}:LeftPanelSearch){
  const isMobile = useMobile()
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  return(
    <div>
      {isMobile 
      ?
      <div className=" absolute mt-[-25px]">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen} >
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-2 w-2 " />
                Filtros
              </Button>
            </SheetTrigger>
    <SheetContent side="left" className="">
      <SheetHeader>
        <SheetTitle>Filtrar Tours</SheetTitle>
      </SheetHeader>
    <div className="mt-6 overflow-y-auto">
    <div className='flex flex-col w-full space-y-10 p-4'>
      <TourSearchComponent destinations={destinations}/>
      <TourCategoryList categories={categories}/>
      <PriceFilter />
    </div>
        </div>
            </SheetContent>
          </Sheet>
        </div>
        :
        <div className='flex flex-col w-full space-y-10 p-4'>
      <TourSearchComponent destinations={destinations}/>
      <TourCategoryList categories={categories}/>
      <PriceFilter />
        </div>
      }
      
    
    
    </div>
  )
}

interface TourSearchComponentProps {
  destinations: Destination[];
}



 function TourSearchComponent({destinations}:TourSearchComponentProps) {
  const [isOpen, setIsOpen] = React.useState(false); // Default to open
  const [destinoTemp,setDestinoTemp] = React.useState("")

  const selectedOption = destinations.find((dest) => dest.name === destinoTemp)
  return (
    <div className="  p-0 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 border-b border-[#d9d9d9]">
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
                <MapPin className="w-6 h-6 text-[#2970b7] " />
              </div>
              <div className="flex-1">
                <label className="block text-[#2970b7] text-lg font-medium mb-2">Destino</label>
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className="min-w-[250px] text-left text-lg bg-white border border-[#d9d9d9] rounded-lg px-3 py-2 pr-10 outline-none focus:border-[#2970b7] focus:ring-2 focus:ring-[#2970b7]/20 cursor-pointer transition-all duration-200 hover:border-[#2970b7]/50 flex items-center gap-2 relative"
                    >
                      {selectedOption ? (
                        <>
                          <MapPin className="w-4 h-4 text-[#2970b7]" />
                          <span className="text-[#333]">{selectedOption.name}</span>
                        </>
                      ) : (
                        <span className="text-[#adadac]">Seleccionar destino</span>
                      )}
                      <ChevronDown
                        className={`w-5 h-5 text-[#adadac] transition-transform duration-200 absolute right-3 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="relative">
                    <div className="absolute top-1 left-0 right-0 bg-white border border-[#d9d9d9] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {destinations.map((destination) => (
                        <div
                          key={destination.name}
                          onClick={() => {
                            setDestinoTemp(destination.name)
                            setIsOpen(false)
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-[#f5f5f5] transition-colors duration-150 flex items-center gap-2 text-[#333] first:rounded-t-lg last:rounded-b-lg"
                        >
                          <MapPin className="w-4 h-4 text-[#2970b7]" />
                          {destination.name}
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>

          {/* Date Field */}
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
          onClick={()=>{
          }}
          className="w-full bg-[#2970b7] text-white py-4 px-6 rounded-2xl font-medium text-lg flex items-center justify-center gap-3 hover:bg-[#2970b7]/90 transition-colors">
            Buscar
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export  function TourSearchBoxHorizontal({destinations}:TourSearchComponentProps) {
  const [isOpen, setIsOpen] = React.useState(false); // Default to open
  const [destinoTemp,setDestinoTemp] = React.useState("Cusco")

  const selectedOption = destinations.find((dest) => dest.name === destinoTemp)
  return (
    <div className="bg-white rounded-full shadow-lg border border-gray-200 px-8 py-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-8">
        {/* Destinos Dropdown */}
        <div className="flex items-center gap-3 flex-1 relative">
          <MapPin className="w-8 h-8 text-[#2970b7] flex-shrink-0" />
          <div className="relative flex-1"></div>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className="min-w-[250px] text-left text-lg bg-white border border-[#d9d9d9] rounded-lg px-3 py-2 pr-10 outline-none focus:border-[#2970b7] focus:ring-2 focus:ring-[#2970b7]/20 cursor-pointer transition-all duration-200 hover:border-[#2970b7]/50 flex items-center gap-2 relative"
                    >
                      {selectedOption ? (
                        <>
                          <MapPin className="w-4 h-4 text-[#2970b7]" />
                          <span className="text-[#333]">{selectedOption.name}</span>
                        </>
                      ) : (
                        <span className="text-[#adadac]">Seleccionar destino</span>
                      )}
                      <ChevronDown
                        className={`w-5 h-5 text-[#adadac] transition-transform duration-200 absolute right-3 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="relative">
                    <div className="absolute top-1 left-0 right-0 bg-white border border-[#d9d9d9] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {destinations.map((destination) => (
                        <div
                          key={destination.name}
                          onClick={() => {
                            setDestinoTemp(destination.name)
                            setIsOpen(false)
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-[#f5f5f5] transition-colors duration-150 flex items-center gap-2 text-[#333] first:rounded-t-lg last:rounded-b-lg cursor-pointer"
                        >
                          <MapPin className="w-4 h-4 text-[#2970b7]" />
                          {destination.name}
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
        </div>

        {/* Separador */}
        <div className="w-px h-12 bg-gray-200"></div>

        {/* Selector de día */}
        <div className="flex items-center gap-3 flex-1">
          <Calendar className="w-6 h-6 text-[#79368c] fill-current flex-shrink-0" />
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="text-[#686868] font-medium">Día</span>
            <ChevronDown className="w-5 h-5 text-[#686868]" />
          </div>
        </div>

        {/* Botón de búsqueda */}
        <Link href={`/destinos?destination=${destinoTemp}&categories=`} >
        <button className="bg-[#2970b7] hover:bg-[#2970b7]/90 text-white px-6 py-3 rounded-full flex items-center gap-2 font-medium transition-colors shadow-md hover:shadow-lg"
        >
          <span>Buscar</span>
          <Search className="w-5 h-5" />
        </button>
        </Link>
      </div>
    </div>
  )
}



interface TourCategoryListProps {
  categories: TourCategory[]
  title?: string
}





function TourCategoryList({ categories, title = "Categorías" }: TourCategoryListProps) {
  const [isOpen, setIsOpen] = React.useState(true)
  const [selectedCategories, setSelectedCategories] = useQueryState('categories', parseAsArrayOf(parseAsString).withOptions({shallow:false}))

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 border-b border-[#d9d9d9]">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#adadac] rounded-full"></div>
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2 text-[#2970b7] text-xl font-semibold tracking-wide hover:text-[#2970b7]/80 transition-colors">
                {title.toUpperCase()}
                <ChevronDown
                  className={`w-5 h-5 text-[#adadac] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
            </CollapsibleTrigger>
          </div>
        </div>

        {/* Content */}
        <CollapsibleContent>
          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
            </div>

            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center space-x-3 py-2 hover:bg-[#f5f5f5] rounded-lg px-3 transition-colors duration-150"
                >
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories?.includes(category.name)}
                    onCheckedChange={(checked) => {
                      const isSelected = checked === true || checked === "indeterminate"
                      setSelectedCategories((prev) => {
                        if (isSelected) {
                          return [...prev!, category.name]
                        } else {
                          return prev!.filter((c) => c !== category.name)
                        }
                      })
                    }}
                    className="data-[state=checked]:bg-[#2970b7] data-[state=checked]:border-[#2970b7]"
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-[#333] text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}


export  function PriceFilter() {
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
