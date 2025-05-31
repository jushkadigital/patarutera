"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"
import Image from 'next/image';
import Link from 'next/link';
import React from "react";
import RichText from "./RichText";
import { Destination, Media, Tour } from "@/cms-types";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";

export type CardTourData = Pick<Tour, 'id' | 'title'| 'miniDescription' | 'featuredImage' | 'Desde' | 'price' | 'Person desc' | 'iconMaxPassengers' | 'maxPassengers' |'iconDifficulty' | 'difficulty' | 'slug' | 'destinos'>
interface CardTourProps {
  unitData: CardTourData;
  mode?: 'grid' | 'list';
}

export default function CardTour({unitData, mode='list'}: CardTourProps) {
  console.log('render card')
  if (mode === 'grid') {
    return (
        <Card className="max-w-sm mx-auto overflow-hidden rounded-3xl shadow-lg py-0 gap-3 h-[680px]">
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="outline" className="bg-white px-6 py-2 rounded-full border-0">
            {/* destinos */}
            <span className="text-[#79368c] font-bold uppercase">
            {unitData.destinos && (unitData.destinos as Destination).name}
              </span>
          </Badge>
        </div>
        <Image
          alt={unitData.title || "Imagen del Tour"}
          src={(unitData.featuredImage as Media).url!}
          width={400}
          height={430}
          className="w-full h-[430px] object-cover"
        />
      </div>

          {/* Content section */}
          <CardContent className="px-6">

        {/* title */}
        <h2 className="text-[#2970b7] text-2xl font-bold mb-1 text-center">
          {unitData.title}
          </h2>
        {/* miniDescription */}
        <div className="text-[#6a6a6a] text-[12px] mb-3">
          { <RichText data={unitData.miniDescription} enableGutter={false} />}
        </div>

        <div className="flex flex-wrap justify-between items-end mb-0 px-10">
          <div>
            
              {/* desde */}
            <p className="text-[#6a6a6a] text-[13px] mb-1">
              {unitData.Desde}
              </p>
            <div className="flex items-baseline">
              {/* price */}
              <span className="text-[#2970b7] text-3xl font-bold">
               S/. {unitData.price}
                </span>
            </div>
              {/* Person desc */}
            <p className="text-[#6a6a6a] text-[11px]">
              {unitData['Person desc']}
              </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 h-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    <Image src={(unitData.iconMaxPassengers as Media).url!} alt="Max Passengers" width={18} height={15} />
                    {/* maxPassengers*/}
                    <span className="text-[#6a6a6a] text-[11px]">
                      Hasta {unitData.maxPassengers}
                      </span>
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
                    <Image src={(unitData.iconDifficulty as Media).url!} alt="Difficulty" width={18} height={15} />
                    {/* difficulty */}
                    <span className="text-[#6a6a6a] text-[11px]">
                      {unitData.difficulty}
                      </span>
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
        <CardFooter className="px-6 pb-6 pt-0">
         <Link href={`/tours/${unitData.slug}`} className="w-full flex justify-center">
        <Button className="w-fit bg-[#3eae64] hover:bg-[#35a058] text-white font-semibold p-0 px-3 py-3 text-[16px] rounded-full ">
          Ver Detalles
        </Button>
         </Link>
      </CardFooter>
        </Card>
    );
  } else { // mode === 'list'
    return (
      <Card className="overflow-hidden shadow-lg max-w-full rounded-3xl flex flex-row py-0 max-h-[300px]">
          {/* Section 1: Image (Left) */}
          <div className="w-1/3 relative">
            <div className="absolute top-4 left-4 z-10">
              <Badge variant="outline" className="bg-white px-6 py-2 rounded-full border-0">
                <span className="text-[#79368c] font-bold">
                   {unitData.destinos && (unitData.destinos as Destination).name}
                  </span>
              </Badge>
            </div>
            <Image
          alt={unitData.title || "Imagen del Tour"}
          src={(unitData.featuredImage as Media).url!}
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Section 2: Title and Description (Middle) */}
          <div className="w-1/3 p-6 flex flex-col justify-center border-r border-gray-100">
            <h2 className="text-[#2970b7] text-3xl font-bold mb-3">
              {unitData.title}
              </h2>
            <div className="text-[#6a6a6a]">
          { <RichText data={unitData.miniDescription} enableGutter={false} />}
            </div>
          </div>

          {/* Section 3: Price, Icons and Button (Right) */}
          <div className="w-1/3 p-6 flex flex-col justify-center">
            <div className="flex flex-col justify-center items-center">
              <div className="mb-6">
                <p className="text-[#6a6a6a] text-sm mb-1">
                  {unitData.Desde}
                </p>
                <div className="flex items-baseline">
                  <span className="text-[#2970b7] text-4xl font-bold">
                    S/. {unitData.price}
                  </span>
                </div>
                <p className="text-[#6a6a6a] text-sm">
                  {unitData["Person desc"]}
                </p>
              </div>

              <div className="flex gap-6 mb-6">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center">
                    <Image src={(unitData.iconMaxPassengers as Media).url!} alt="Max Passengers" width={18} height={15} />
                        <span className="text-[#6a6a6a] text-sm">Hasta {unitData.maxPassengers}</span>
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
                    <Image src={(unitData.iconDifficulty as Media).url!} alt="Difficulty" width={18} height={15} />
                        <span className="text-[#6a6a6a] text-sm">{unitData.difficulty}</span>
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
        <Button className="w-fit bg-[#3eae64] hover:bg-[#35a058] text-white font-semibold p-0 px-3 py-3 text-[16px] rounded-full ">
          Ver Detalles
        </Button>
         </Link>
          </div>
        </Card>
    );
  }
}
