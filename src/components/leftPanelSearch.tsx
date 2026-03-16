"use client";

import * as React from "react";
import {
  MapPin,
  Search,
  ChevronDown,
  Tag,
  Filter,
  Loader2,
  Package,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Destination, TourCategory, Tour, Paquete } from "@/cms-types";
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
import { useRouter, useParams } from "next/navigation";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";

interface LeftPanelSearch {
  categories: TourCategory[];
  title?: string;
  destinations: Destination[];
}

export function LeftPanelSearch({ categories, destinations }: LeftPanelSearch) {
  const isMobile = useMobile({ breakpoint: 1024 });
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  return (
    <div>
      {isMobile ? (
        <div className=" absolute mt-[-25px] ">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
                <div className="flex flex-col w-full space-y-10 p-4">
                  <TourSearchComponent destinations={destinations} />
                  <TourCategoryList categories={categories} />
                  <PriceFilter />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        <div className="flex flex-col w-full space-y-10 p-4">
          <TourSearchComponent destinations={destinations} />
          <TourCategoryList categories={categories} />
          <PriceFilter />
        </div>
      )}
    </div>
  );
}

interface TourSearchComponentProps {
  destinations: Destination[];
}

function TourSearchComponent({ destinations }: TourSearchComponentProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const [filterDestination, setFilterDestination] = useQueryState(
    "filterDestination",
    parseAsString.withOptions({ shallow: false, startTransition }),
  );

  const selectedOption = destinations.find(
    (dest) => dest.name === filterDestination,
  );
  return (
    <div className="  p-0 flex items-center justify-center">
      {isPending && <FilterLoadingOverlay label="Actualizando tours..." />}

      <div className="w-full  bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 border-b border-[#d9d9d9]">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#adadac] rounded-full"></div>
            <h1 className="text-[#2970b7] text-lg lg:text-[clamp(10.9px,1vw,20.48px)] font-semibold tracking-wide">
              BUSCAR TOURS
            </h1>
          </div>
        </div>

        {/* Form Fields */}
        <div className="p-6 space-y-6">
          {/* Destination Field */}
          <div className="border-b border-[#d9d9d9] pb-6">
            <div className="flex items-start gap-[clamp(0px,0.6vw,12.8px)]">
              <div className="mt-1">
                <MapPin className="w-6 h-6 text-[#2970b7] " />
              </div>
              <div className="flex-1 ">
                <label className="block text-[#2970b7] text-lg lg:text-[clamp(10.9px,1vw,20.48px)] font-medium mb-2">
                  Destino
                </label>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-[clamp(170px,16.6vw,320px)] text-left text-lg bg-white border border-[#d9d9d9] rounded-lg px-3 py-2 pr-10 outline-none focus:border-[#2970b7] focus:ring-2 focus:ring-[#2970b7]/20 cursor-pointer transition-all duration-200 hover:border-[#2970b7]/50 flex items-center gap-2 relative"
                    >
                      {selectedOption ? (
                        <>
                          <MapPin className="w-4 h-4 text-[#2970b7]" />
                          <span className="text-[#333]">
                            {selectedOption.name}
                          </span>
                        </>
                      ) : (
                        <span className="text-[#adadac] lg:text-[clamp(10.9px,1vw,20.48px)]">
                          Seleccionar destino
                        </span>
                      )}
                      <ChevronDown
                        className={`w-5 h-5 text-[#adadac] transition-transform duration-200 absolute right-3 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="relative border-none p-0">
                    <div className="w-fit absolute left-1/5 bg-white border border-[#d9d9d9] rounded-lg shadow-lg  max-h-60 z-80">
                      {destinations.map((destination) => (
                        <div
                          key={destination.name}
                          onClick={() => {
                            setFilterDestination(destination.name);
                            setIsOpen(false);
                          }}
                          className="w-[clamp(170px,16.6vw,320px)] text-left px-3 py-2 hover:bg-[#f5f5f5] transition-colors duration-150 flex items-center gap-2 text-[#333] first:rounded-t-lg last:rounded-b-lg"
                        >
                          <MapPin className="w-4 h-4 text-[#2970b7]" />
                          {destination.name}
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TourSearchBoxHorizontal({
  destinations,
}: TourSearchComponentProps) {
  const router = useRouter();
  const params = useParams();
  const countryCode =
    (params?.countryCode as string) ||
    process.env.NEXT_PUBLIC_DEFAULT_REGION ||
    "pe";
  const [isOpen, setIsOpen] = React.useState(false);
  const [destinoTemp, setDestinoTemp] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<{
    tours: Tour[];
    paquetes: Paquete[];
  }>({ tours: [], paquetes: [] });
  const [isSearching, setIsSearching] = React.useState(false);

  // Debounced search function
  const performSearch = React.useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query || query.length < 2) {
          setSearchResults({ tours: [], paquetes: [] });
          setIsSearching(false);
          return;
        }

        try {
          setIsSearching(true);
          const response = await fetch(
            `/api/search?q=${encodeURIComponent(query)}`,
          );

          if (!response.ok) {
            throw new Error("Search request failed");
          }

          const data = await response.json();

          setSearchResults({
            tours: (data.tours as Tour[]) || [],
            paquetes: (data.paquetes as Paquete[]) || [],
          });
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults({ tours: [], paquetes: [] });
        } finally {
          setIsSearching(false);
        }
      }, 300),
    [],
  );

  React.useEffect(() => {
    performSearch(destinoTemp);
    // Cleanup debounce on unmount
    return () => {
      performSearch.cancel();
    };
  }, [destinoTemp, performSearch]);

  const handleSelectResult = (
    slug: string | null | undefined,
    type: "tours" | "paquetes",
  ) => {
    if (!slug) return;
    router.push(`/${countryCode}/${type}/${slug}`);
    setIsOpen(false);
  };

  const handleSearch = () => {
    if (!destinoTemp) return;
    router.push(`/${countryCode}/tours?destination=${destinoTemp}&categories=`);
  };

  const hasResults =
    searchResults.tours.length > 0 || searchResults.paquetes.length > 0;

  return (
    <div className="bg-white rounded-2xl lg:rounded-full shadow-lg border border-gray-200 px-8 py-4 max-w-4xl mx-auto z-50 relative">
      <div className="flex flex-col lg:flex-row items-end lg:items-center justify-between gap-3 lg:gap-8">
        {/* Destinos Autocomplete */}
        <div className="flex items-center lg:gap-3 flex-1 w-full">
          <div className="flex items-center lg:gap-3 flex-1 relative w-full">
            <MapPin className="w-5 h-5 lg:w-8 lg:h-8 text-[#2970b7] flex-shrink-0 hidden lg:block" />

            <div className="relative flex-1 w-full">
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <div className="relative w-full">
                    <Input
                      type="text"
                      placeholder="Busca tu proximo Destino"
                      value={destinoTemp}
                      onChange={(e) => {
                        setDestinoTemp(e.target.value);
                        setIsOpen(true);
                      }}
                      onFocus={() => setIsOpen(true)}
                      className="w-full text-lg border-none shadow-none focus-visible:ring-0 px-0 placeholder:text-[#adadac] text-[#333]"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0 w-[300px] lg:w-[400px] max-h-[400px] overflow-y-auto"
                  align="start"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  {isSearching ? (
                    <div className="p-4 flex items-center justify-center text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Buscando...
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {/* Section: Tours */}
                      {searchResults.tours.length > 0 && (
                        <div className="py-2 border-t">
                          <div className="px-3 py-1 text-xs font-semibold text-muted-foreground bg-gray-50">
                            TOURS
                          </div>
                          {searchResults.tours.map((tour) => (
                            <button
                              key={tour.id}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                              onClick={() =>
                                handleSelectResult(tour.slug, "tours")
                              }
                            >
                              <Tag className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <span className="truncate">{tour.title}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Section: Paquetes */}
                      {searchResults.paquetes.length > 0 && (
                        <div className="py-2 border-t">
                          <div className="px-3 py-1 text-xs font-semibold text-muted-foreground bg-gray-50">
                            PAQUETES
                          </div>
                          {searchResults.paquetes.map((paquete) => (
                            <button
                              key={paquete.id}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                              onClick={() =>
                                handleSelectResult(paquete.slug, "paquetes")
                              }
                            >
                              <Package className="w-4 h-4 text-purple-600 flex-shrink-0" />
                              <span className="truncate">{paquete.title}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {!hasResults && destinoTemp.length >= 2 && (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          No se encontraron resultados
                        </div>
                      )}
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Separador */}
          <div className="hidden lg:block h-8 w-px bg-gray-200 mx-4"></div>
        </div>

        {/* Botón de búsqueda */}
        <button
          onClick={handleSearch}
          className="bg-[#2970b7] hover:bg-[#2970b7]/90 text-white px-6 py-3 rounded-full flex items-center gap-2 font-medium transition-colors shadow-md hover:shadow-lg w-full lg:w-auto justify-center"
        >
          <span>Buscar</span>
          <Search className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

interface TourCategoryListProps {
  categories: TourCategory[];
  title?: string;
}

function TourCategoryList({
  categories,
  title = "Categorías",
}: TourCategoryListProps) {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isPending, startTransition] = React.useTransition();
  const [selectedCategories, setSelectedCategories] = useQueryState(
    "categories",
    parseAsArrayOf(parseAsString).withOptions({
      shallow: false,
      startTransition,
    }),
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      {isPending && <FilterLoadingOverlay label="Actualizando tours..." />}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 border-b border-[#d9d9d9]">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#adadac] rounded-full"></div>
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2 text-[#2970b7] text-lg lg:text-[clamp(10.9px,1vw,20.48px)] font-semibold tracking-wide hover:text-[#2970b7]/80 transition-colors">
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
            <div className="flex items-start gap-4 mb-4"></div>

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
                      const isSelected =
                        checked === true || checked === "indeterminate";
                      setSelectedCategories((prev) => {
                        if (isSelected) {
                          return [...prev!, category.name];
                        } else {
                          return prev!.filter((c) => c !== category.name);
                        }
                      });
                    }}
                    className="data-[state=checked]:bg-[#2970b7] data-[state=checked]:border-[#2970b7]"
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-[#333] text-lg lg:text-[clamp(10.9px,1vw,20.48px)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
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
  );
}

export function PriceFilter() {
  const minPrice = 0;
  const maxPrice = 1999;

  const { priceOne: priceRange, setPriceOne: setPriceRange } = useSharedState();

  return (
    <div className="w-full  mx-auto rounded-3xl border border-[#e3e3e3] bg-white p-6">
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
