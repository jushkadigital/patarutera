"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import Link from 'next/link';
import React from "react";
import RichText from "./RichText";
import { Destination, Media, Tour } from "@/cms-types";

export type CardTourData = Pick<Tour, 'id' | 'title'| 'miniDescription' | 'featuredImage' | 'Desde' | 'price' | 'Person desc' | 'iconMaxPassengers' | 'maxPassengers' |'iconDifficulty' | 'difficulty' | 'slug' | 'destinos'>
interface CardTourProps {
  unitData: CardTourData;
  mode?: 'grid' | 'list';
}

export default function CardTour({unitData, mode='list'}: CardTourProps) {
  if (mode === 'grid') {
    return (
      <div className="relative w-[338px] font-poppins">
        <Card className="overflow-hidden rounded-t-[20px] border border-solid border-[#efefef] shadow-[0px_4px_4px_#0000000d]">
          {/* Image section */}
          <div className="relative h-[427px] w-full rounded-t-[20px] overflow-hidden">
            {/* Label AQUI */}
            <span className="absolute top-2 left-2 z-10 rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-[#79368C]">
            {unitData.destinos && (unitData.destinos as Destination).name}
            </span>
            <Image
              className="object-cover"
              alt={unitData.title || "Imagen del Tour"}
              src={(unitData.featuredImage as Media).url!}
              fill
              priority
            />
          </div>

          {/* Content section */}
          <CardContent className="p-0">
            <div className="relative px-6 pb-6 pt-3">
              {/* Title */}
              <h2 className="text-center text-xl font-bold text-[#2970b7]">
                {unitData.title}
              </h2>

              {/* Description */}
              <div className="mt-2 text-xs font-light text-black">
                { <RichText data={unitData.miniDescription} enableGutter={false} />}
              </div>
              <div className="mt-4 flex flex-row justify-between items-center">
                {/* Price section */}
                <div className="flex flex-col">
                  <p className="text-[13px] font-medium text-[#6a6a6a]">
                    {unitData.Desde}
                  </p>
                  <p className="text-[28px] font-bold text-[#2970b7]">
                    ${unitData.price}
                  </p>
                  <p className="text-[11px] font-medium text-[#6a6a6a]">
                    {unitData['Person desc']}
                  </p>
                </div>
                {/* Icons section */}
                <div className="flex flex-col space-y-2 items-end">
                  <div className="flex items-center space-x-1.5">
                    <Image src={(unitData.iconMaxPassengers as Media).url!} alt="Max Passengers" width={18} height={15} />
                    <p className="text-xs font-medium text-[#6a6a6a]">
                      {unitData.maxPassengers}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Image src={(unitData.iconDifficulty as Media).url!} alt="Difficulty" width={18} height={15} />
                    <p className="text-xs font-medium text-[#6a6a6a]">
                      {unitData.difficulty}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-center items-center w-full">
                <Link href={`/tours/${unitData.slug}`}>
                  <div className="bg bg-[#3EAE64] text-white px-4 py-2 rounded-xl w-1/2 text-center cursor-pointer">
                    Ver Detalles
                  </div>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } else { // mode === 'list'
    return (
      <div className="relative w-full font-poppins my-4">
        <Card className="flex flex-row overflow-hidden rounded-[20px] border border-solid border-[#efefef] shadow-md h-auto md:h-60">
          {/* Image section - List Mode */}
          <div className="relative w-1/3 md:w-48 h-full rounded-l-[20px] overflow-hidden flex-shrink-0">
            {/* Label AQUI */}
            <span className="absolute top-2 left-2 z-10 rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-[#79368C]">
            {unitData.destinos && (unitData.destinos as Destination).name}
            </span>
            <Image
              className="object-cover"
              alt={unitData.title || "Imagen del Tour"}
              src={(unitData.featuredImage as Media).url!}
              fill
              priority
            />
          </div>

          {/* Content section - List Mode */}
          <CardContent className="flex-1 p-4 flex flex-col md:flex-row md:items-start md:space-x-4">
            {/* Título - Limitado en ancho en md+ */}
            <h2 className="text-lg font-bold text-[#2970b7] mb-1 md:mb-0 md:w-1/4 truncate">
              {unitData.title}
            </h2>

            {/* Descripción - Ocupa espacio flexible */}
            <div className="flex-1 text-xs font-light text-black mb-2 md:mb-0 max-h-20 overflow-y-auto">
              {/* Aplicar line-clamp si es necesario con plugin, o limitar altura con CSS */}
              { <RichText data={unitData.miniDescription} enableGutter={false} />}
            </div>

            {/* Contenedor para Precio e Iconos - A la derecha en md+ */}
            <div className="flex-shrink-0 flex flex-col space-y-2 items-center mt-2 md:mt-0">
              {/* Price section - List Mode */}
              <div className="text-left md:text-center">
                <p className="text-xs font-medium text-[#6a6a6a]">
                  {unitData.Desde}
                </p>
                <p className="text-xl font-bold text-[#2970b7]">
                  ${unitData.price}
                </p>
                <p className="text-[10px] font-medium text-[#6a6a6a]">
                  {unitData['Person desc']}
                </p>
              </div>
              {/* Icons section - List Mode */}
              <div className="flex space-x-3 md:space-x-0 flex-row md:space-y-1 items-start md:items-end">
                <div className="flex items-center space-x-1">
                  <Image src={(unitData.iconMaxPassengers as Media).url!} alt="Max Passengers" width={16} height={13} />
                  <p className="text-xs font-medium text-[#6a6a6a]">
                    {unitData.maxPassengers}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <Image src={(unitData.iconDifficulty as Media).url!} alt="Difficulty" width={16} height={13} />
                  <p className="text-xs font-medium text-[#6a6a6a]">
                    {unitData.difficulty}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
