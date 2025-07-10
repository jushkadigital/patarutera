"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Destination, Media, Paquete, Tour } from "@/cms-types";
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import RichText from "./RichText"

export type CardTourData = Pick<Tour, 'id' | 'title'| 'miniDescription' | 'featuredImage' | 'Desde' | 'price' | 'Person desc' | 'iconMaxPassengers' | 'maxPassengers' |'iconDifficulty' | 'difficulty' | 'slug' | 'destinos'>

interface CardTourProps {
  unitData: CardTourData
  mode?: "grid" | "list"
}

const trad = {
  easy: 'Facil',
  medium: 'Intermedio',
  hard: 'Dificil'
}

export default function CardTour({ unitData, mode = "list" }: CardTourProps) {
  console.log("render card")

  if (mode === "grid") {
    return (
      <Card className="w-full max-w-sm mx-auto overflow-hidden rounded-3xl shadow-lg py-0 gap-3 h-[680px] sm:h-[650px] md:h-[680px] group hover:shadow-2xl transition-all duration-500 hover:shadow-blue-500/25">
          <Link href={`/tours/${unitData.slug}`}>
        <div className="relative h-[400px] w-full overflow-hidden">
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
            <Badge variant="outline" className="bg-white px-3 py-1 sm:px-6 sm:py-2 rounded-full border-0">
              <span className="text-[#79368c] font-bold uppercase text-xs sm:text-sm">
                {unitData.destinos && (unitData.destinos as Destination).name}
              </span>
            </Badge>
          </div>
          <Image
            alt={unitData.title || "Imagen del Tour"}
            src={(unitData.featuredImage as Media).url! || "/placeholder.svg"}
            fill
            className=" object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-2"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

            {/* Efecto de brillo que se mueve */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </div>
          </Link>

        {/* Content section */}
        <CardContent className="px-4 sm:px-6">
          {/* title */}
        <Link href={`/tours/${unitData.slug}`}>
          <h2 className="text-[#2970b7] text-xl sm:text-2xl font-bold mb-1 text-center leading-tight">
            {unitData.title}
          </h2>
          </Link>
          {/* miniDescription */}
          <div className="text-[#6a6a6a] text-xs sm:text-[12px] mb-3 text-center sm:text-left">
            <RichText data={unitData.miniDescription} enableGutter={false} />
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-center sm:items-end mb-0 px-2 sm:px-10 gap-4 sm:gap-0">
            <div className="text-center sm:text-left">
              {/* desde */}
              <p className="text-[#6a6a6a] text-xs sm:text-[13px] mb-1">{unitData.Desde}</p>
              <div className="flex items-baseline justify-center sm:justify-start">
                {/* price */}
                <span className="text-[#2970b7] text-2xl sm:text-3xl font-bold">S/. {unitData.price}</span>
              </div>
              {/* Person desc */}
              <p className="text-[#6a6a6a] text-xs sm:text-[11px]">{unitData["Person desc"]}</p>
            </div>

            <div className="flex flex-row sm:flex-col items-center justify-center gap-4 sm:gap-2 h-full">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center">
                      <Image
                        src={(unitData.iconMaxPassengers as Media).url! || "/placeholder.svg"}
                        alt="Max Passengers"
                        width={16}
                        height={13}
                        className="sm:w-[18px] sm:h-[15px]"
                      />
                      <span className="text-[#6a6a6a] text-xs sm:text-[11px] mt-1">Hasta {unitData.maxPassengers}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Capacidad máxima de {unitData.maxPassengers} personas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center">
                      <Image
                        src={(unitData.iconDifficulty as Media).url! || "/placeholder.svg"}
                        alt="Difficulty"
                        width={16}
                        height={13}
                        className="sm:w-[18px] sm:h-[15px]"
                      />
                      <span className="text-[#6a6a6a] text-xs sm:text-[11px] mt-1">{trad[unitData.difficulty]}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nivel de dificultad {unitData.difficulty}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
          <Link href={`/tours/${unitData.slug}`} className="w-full flex justify-center cursor-pointer">
            <Button className="w-fit bg-[#3eae64] hover:bg-[#35a058] text-white font-semibold px-6 py-3 sm:px-3 sm:py-3 text-sm sm:text-[16px] rounded-full cursor-pointer">
              Ver Detalles
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  } else {
    // mode === 'list' - Responsive: vertical on mobile, horizontal on larger screens
    return (
      <Card className="overflow-hidden shadow-lg w-full rounded-3xl flex flex-col md:flex-row py-0 md:max-h-[300px] group hover:shadow-2xl transition-all duration-500 hover:shadow-blue-500/25">
        {/* Section 1: Image */}
        
          <Link href={`/tours/${unitData.slug}`} className="">
        <div className=" relative h-[350px] w-[300px] overflow-hidden">
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
            <Badge variant="outline" className="bg-white px-3 py-1 sm:px-6 sm:py-2 rounded-full border-0">
              <span className="text-[#79368c] font-bold uppercase text-xs sm:text-sm">
                {unitData.destinos && (unitData.destinos as Destination).name}
              </span>
            </Badge>
          </div>

          <Image
            alt={unitData.title || "Imagen del Tour"}
            src={(unitData.featuredImage as Media).url! || "/placeholder.svg"}
            fill
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-2"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

            {/* Efecto de brillo que se mueve */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </div>
        </Link>

        {/* Section 2: Title and Description */}
        <div className="w-full md:w-1/3 p-4 sm:p-6 flex flex-col justify-center md:border-r border-gray-100">
        <Link href={`/tours/${unitData.slug}`}>
          <h2 className="text-[#2970b7] text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-center md:text-left">
            {unitData.title}
          </h2>
        </Link>
          <div className="text-[#6a6a6a] text-sm sm:text-base text-center md:text-left">
            <RichText data={unitData.miniDescription} enableGutter={false} />
          </div>
        </div>

        {/* Section 3: Price, Icons and Button */}
        <div className="w-full md:w-1/3 p-4 sm:p-6 flex flex-col justify-center">
          <div className="flex flex-col justify-center items-center">
            <div className="mb-4 sm:mb-6 text-center">
              <p className="text-[#6a6a6a] text-sm mb-1">{unitData.Desde}</p>
              <div className="flex items-baseline justify-center">
                <span className="text-[#2970b7] text-3xl sm:text-4xl font-bold">S/. {unitData.price}</span>
              </div>
              <p className="text-[#6a6a6a] text-sm">{unitData["Person desc"]}</p>
            </div>

            <div className="flex gap-6 sm:gap-6 mb-4 sm:mb-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center">
                      <Image
                        src={(unitData.iconMaxPassengers as Media).url! || "/placeholder.svg"}
                        alt="Max Passengers"
                        width={16}
                        height={13}
                        className="sm:w-[18px] sm:h-[15px]"
                      />
                      <span className="text-[#6a6a6a] text-xs sm:text-sm mt-1">Hasta {unitData.maxPassengers}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Capacidad máxima de {unitData.maxPassengers} personas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center">
                      <Image
                        src={(unitData.iconDifficulty as Media).url! || "/placeholder.svg"}
                        alt="Difficulty"
                        width={16}
                        height={13}
                        className="sm:w-[18px] sm:h-[15px]"
                      />
                      <span className="text-[#6a6a6a] text-xs sm:text-sm mt-1">{trad[unitData.difficulty]} </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nivel de dificultad {unitData.difficulty}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <Link href={`/tours/${unitData.slug}`} className="w-full flex justify-center">
            <Button className="w-fit bg-[#3eae64] hover:bg-[#35a058] text-white font-semibold px-6 py-3 sm:px-3 sm:py-3 text-sm sm:text-[16px] rounded-full">
              Ver Detalles
            </Button>
          </Link>
        </div>
      </Card>
    )
  }
}

