"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "@/components/PayloadImage";
import {
  MeiliCompleteImage,
  toMediaFromMeiliCompleteImage,
  toMediaFromUrl,
} from "@/lib2/meili-image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Destination, Media, Paquete } from "@/cms-types";
import Link from "next/link";

import RichText from "./RichText";

export interface CardPaqueteData {
  id: number | string;
  title?: string | null;
  slug?: string | null;
  miniDescription?: Paquete["miniDescription"] | null;
  descriptionText?: string | null;
  featuredImage?: Paquete["featuredImage"] | null;
  meiliImage?: string | null;
  meiliCompleteImage?: MeiliCompleteImage | null;
  destinationName?: string | null;
  destinos?: Paquete["destinos"] | null;
  Desde?: string | null;
  price?: number | null;
  "Person desc"?: string | null;
  iconMaxPassengers?: Paquete["iconMaxPassengers"] | null;
  maxPassengers?: number | null;
  iconDifficulty?: Paquete["iconDifficulty"] | null;
  difficulty?: Paquete["difficulty"] | null;
  medusaId?: string | null;
  priceMedusa?: {
    amount: number;
    currency: string;
  } | null;
}

interface CardPaqueteProps {
  unitData: CardPaqueteData;
  mode?: "grid" | "list";
}

const trad = {
  easy: "Facil",
  medium: "Intermedio",
  hard: "Dificil",
};

const STATIC_FALLBACK = {
  image: "/backgroundDestinoPage.png",
  difficultyIcon: "/difficultyData.svg",
  passengersIcon: "/groupSizeData.svg",
  from: "Desde",
  destination: "Destino",
  personDesc: "Por persona",
  maxPassengers: 18,
  difficulty: "easy" as const,
  price: 299,
  description: "Vive una experiencia unica con Patarutera.",
};

function isMedia(value: unknown): value is Media {
  return typeof value === "object" && value !== null && "url" in value;
}

function isDestination(value: unknown): value is Destination {
  return typeof value === "object" && value !== null && "name" in value;
}

function getPaqueteHref(unitData: CardPaqueteData): string {
  return unitData.slug ? `/pe/paquetes/${unitData.slug}` : "/pe/paquetes";
}

function getDestinationName(unitData: CardPaqueteData): string {
  if (unitData.destinationName) {
    return unitData.destinationName;
  }

  if (Array.isArray(unitData.destinos) && unitData.destinos.length > 0) {
    return unitData.destinos
      .filter(isDestination)
      .map((d) => d.name)
      .join(", ");
  }

  if (isDestination(unitData.destinos)) {
    return unitData.destinos.name;
  }

  return STATIC_FALLBACK.destination;
}

function getPrice(unitData: CardPaqueteData): number {
  if (typeof unitData.priceMedusa?.amount === "number") {
    return unitData.priceMedusa.amount;
  }

  if (typeof unitData.price === "number") {
    return unitData.price;
  }

  return STATIC_FALLBACK.price;
}

function getDifficulty(unitData: CardPaqueteData): keyof typeof trad {
  if (unitData.difficulty && unitData.difficulty in trad) {
    return unitData.difficulty as keyof typeof trad;
  }

  return STATIC_FALLBACK.difficulty;
}

function renderPaqueteImage(unitData: CardPaqueteData, className: string) {
  if (isMedia(unitData.featuredImage)) {
    return <Image media={unitData.featuredImage} fill className={className} />;
  }

  const meiliResponsiveMedia = toMediaFromMeiliCompleteImage(
    unitData.meiliCompleteImage,
    unitData.title,
  );

  if (meiliResponsiveMedia) {
    return <Image media={meiliResponsiveMedia} fill className={className} />;
  }

  const fallbackMedia = toMediaFromUrl(
    unitData.meiliImage ?? STATIC_FALLBACK.image,
    unitData.title,
  );

  if (fallbackMedia) {
    return <Image media={fallbackMedia} fill className={className} />;
  }

  return (
    <img
      src={STATIC_FALLBACK.image}
      alt={unitData.title ?? "Paquete"}
      className={className}
    />
  );
}

function renderIcon(
  media:
    | Paquete["iconDifficulty"]
    | Paquete["iconMaxPassengers"]
    | null
    | undefined,
  fallbackSrc: string,
  className: string,
) {
  if (isMedia(media)) {
    return <Image media={media} className={className} />;
  }

  return <img src={fallbackSrc} alt="icon" className={className} />;
}

function renderDescription(unitData: CardPaqueteData, className: string) {
  if (unitData.miniDescription) {
    return (
      <RichText
        data={unitData.miniDescription}
        enableGutter={false}
        className={className}
      />
    );
  }

  const text = unitData.descriptionText ?? STATIC_FALLBACK.description;
  return <p className="line-clamp-3">{text}</p>;
}

export default function CardPaquete({
  unitData,
  mode = "list",
}: CardPaqueteProps) {
  const href = getPaqueteHref(unitData);
  const destinationName = getDestinationName(unitData);
  const price = getPrice(unitData);
  const difficulty = getDifficulty(unitData);
  const maxPassengers = unitData.maxPassengers ?? STATIC_FALLBACK.maxPassengers;
  const fromLabel = unitData.Desde ?? STATIC_FALLBACK.from;
  const personDesc = unitData["Person desc"] ?? STATIC_FALLBACK.personDesc;

  if (mode === "grid") {
    return (
      <Card className="w-full max-w-[435px] mx-auto overflow-hidden rounded-3xl shadow-lg py-0 gap-3 h-[clamp(0px,166vw,1341.2px)] sm:h-[clamp(190.44px,74vw,883.2px)] lg:h-[clamp(190.44px,48vw,883.2px)] group hover:shadow-2xl transition-all duration-500 hover:shadow-blue-500/25">
        <Link href={href} className="h-[63%]">
          <div className="relative h-full  w-full overflow-hidden">
            <div className="absolute top-2 left-2 sm:top-4 md:top-3 lg:top-1 sm:left-4 z-10 w-fit">
              <Badge
                variant="outline"
                className="bg-white  py-[clamp(1.3px,0.9vw,4.56px)] sm:py-[clamp(1.3px,0.6vw,4.56px)] lg:py-[clamp(1.3px,0.4vw,4.56px)] px-[clamp(0px,1.92vw,10.24px)]  lg:px-[clamp(3.31px,0.8vw,15.16px)]  rounded-full border-0  "
              >
                <span className="text-[#79368c] font-semibold uppercase text-[clamp(0px,2.8vw,15.36px)] sm:text-[clamp(0px,1.5vw,15.36px)] lg:text-[clamp(3.5px,0.8vw,16.64px)]">
                  {destinationName}
                </span>
              </Badge>
            </div>
            {renderPaqueteImage(
              unitData,
              " object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-2",
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          </div>
        </Link>

        <CardContent className="px-4 sm:px-6 h-[37%]">
          <Link href={href}>
            <div className="flex justify-center items-center h-[clamp(0px,10.89vw,111.6px)] sm:h-[clamp(0px,3.19vw,111.6px)] lg:h-[clamp(12px,3vw,57.6px)]">
              <h2 className="text-[#2970b7] text-[clamp(0px,4.83vw,49.46px)]  sm:text-[clamp(5.96px,1.9vw,24.96px)] lg:text-[clamp(5.52px,1.3vw,25.6px)] font-bold text-center leading-tight  multi-line-truncate multi-line-truncate-2">
                {unitData.title}
              </h2>
            </div>
          </Link>

          <div className="text-[#6a6a6a]">
            {renderDescription(
              unitData,
              "h-[clamp(0px,10.07vw,124px)] sm:h-[clamp(0px,7.07vw,124px)] lg:h-[clamp(13.8px,4.7vw,84px)]! !my-1 lg:!my-1 prose-custom-lg  prose-pink",
            )}
          </div>

          <div className="flex flex-row flex-wrap justify-around lg:justify-around items-center sm:items-end mb-0 px-2  gap-0 sm:gap-0  mt-[clamp(0px,2.41vw,24.73px)] lg:mt-[clamp(2.7px,0.6vw,12.8px)]">
            <div className="text-center sm:text-left">
              <p className="text-[#6a6a6a]  text-[clamp(13.28px,3.2vw,33.84px)]  sm:text-[clamp(5.68px,1.5vw,33.84px)] lg:text-[clamp(3.5px,0.86vw,16.64px)] ">
                {fromLabel}
              </p>
              <div className="flex items-baseline justify-center sm:justify-start">
                <span className="text-[#2970b7] text-[clamp(0px,6.76vw,69.25px)] sm:text-[clamp(0px,2.76vw,69.25px)]  lg:text-[clamp(7.78px,1.86vw,35.84px)] font-bold">
                  S/. {price}
                </span>
              </div>
              <p className="text-[#6a6a6a] text-[clamp(0px,2.65vw,27.2px)] sm:text-[clamp(0px,1.15vw,27.2px)] lg:text-[clamp(3.03px,0.7vw,14.08px)]">
                {personDesc}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center lg:gap-[clamp(0.2px,0.1vw,3px)] h-full">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center">
                      {renderIcon(
                        unitData.iconMaxPassengers,
                        STATIC_FALLBACK.passengersIcon,
                        "w-[clamp(0px,4.33vw,44.2px)] sm:w-[clamp(0px,2.33vw,44.2px)] lg:w-[clamp(4.9px,1.2vw,23px)] h-auto",
                      )}
                      <span className="text-[#6a6a6a] text-[clamp(0px,2.65vw,27.20px)] sm:text-[clamp(0px,1.15vw,27.20px)] lg:text-[clamp(3.03px,0.7vw,14.08px)] mt-1">
                        Hasta {maxPassengers}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Capacidad maxima de {maxPassengers} personas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center">
                      {renderIcon(
                        unitData.iconDifficulty,
                        STATIC_FALLBACK.difficultyIcon,
                        "w-[clamp(0px,4.33vw,44.2px)] sm:w-[clamp(0px,2.33vw,44.2px)] lg:w-[clamp(4.9px,1.2vw,23px)] h-auto",
                      )}
                      <span className="text-[#6a6a6a] text-[clamp(0px,2.65vw,27.20px)] sm:text-[clamp(0px,1.15vw,27.20px)] lg:text-[clamp(3.03px,0.7vw,14.08px)] mt-1">
                        {trad[difficulty]}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nivel de dificultad {difficulty}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="w-full flex flex-row mt-[clamp(0px,4.1vw,42.04px)] sm:mt-[clamp(0px,1.5vw,42.04px)] lg:mt-[clamp(4.6px,1.13vw,21.76px)]">
            <div className="w-1/2"></div>
            <Link
              href={href}
              className="w-full flex justify-center cursor-pointer w-1/2"
            >
              <Button className="w-fit h-fit bg-[#3eae64] hover:bg-[#35a058] text-white font-semibold  py-[clamp(0px,1.20vw,12.36px)] sm:py-[clamp(0px,0.70vw,12.36px)] lg:py-[clamp(1.38px,0.3vw,6.4px)] px-[clamp(0px,2.89vw,29.68px)]  sm:px-[clamp(0px,1.49vw,29.68px)] lg:px-[clamp(3.31px,0.8vw,15.36px)]  text-[clamp(0px,3.86vw,39.57px)] sm:text-[clamp(0px,1.86vw,39.57px)] lg:text-[clamp(4.4px,1vw,20.48px)] rounded-full cursor-pointer ">
                Ver Detalles
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden gap-1! shadow-lg w-full rounded-3xl flex flex-row py-0 md:h-[clamp(191px,25.66vw,558px)] lg:h-[clamp(191px,18.66vw,358px)]  group hover:shadow-2xl transition-all duration-500 hover:shadow-blue-500/25">
      <Link href={href} className="w-1/3">
        <div className=" relative h-full  overflow-hidden">
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
            <Badge
              variant="outline"
              className="bg-white  py-[clamp(1.3px,0.9vw,4.56px)] sm:py-[clamp(1.3px,0.6vw,4.56px)] lg:py-[clamp(1.3px,0.4vw,4.56px)] px-[clamp(0px,1.92vw,10.24px)]  lg:px-[clamp(3.31px,0.8vw,15.16px)]  rounded-full border-0  "
            >
              <span className="text-[#79368c] font-semibold uppercase text-[clamp(0px,2.8vw,15.36px)] sm:text-[clamp(0px,1.5vw,15.36px)] lg:text-[clamp(3.5px,0.8vw,16.64px)]">
                {destinationName}
              </span>
            </Badge>
          </div>

          {renderPaqueteImage(
            unitData,
            "w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-2",
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </div>
      </Link>

      <div className="w-1/3 p-4 sm:p-2 flex flex-col justify-center gap-y-3 md:border-r border-gray-100">
        <Link href={href}>
          <div className="flex justify-center items-center min-h-15">
            <h2 className="text-[#2970b7] text-2xl sm:text-[clamp(13.65px,2.3vw,25.6px)] md:text-[clamp(13.65px,2.3vw,25.6px)] lg:text-[clamp(13.65px,1.3vw,25.6px)] font-bold text-center leading-tight  multi-line-truncate multi-line-truncate-2">
              {unitData.title}
            </h2>
          </div>
        </Link>
        <div className="text-[#6a6a6a]  text-center md:text-left">
          {renderDescription(unitData, "min-h-1!  !my-2")}
        </div>
      </div>

      <div className="w-1/3 p-1 sm:p-1 flex flex-col justify-center">
        <div className="flex flex-col justify-center items-center">
          <div className="mb-4 sm:mb-6 text-center">
            <p className="text-[#6a6a6a] text-sm mb-1 text-[#6a6a6a]  text-[clamp(13.28px,3.2vw,33.84px)]  sm:text-[clamp(5.68px,1.5vw,33.84px)] lg:text-[clamp(3.5px,0.86vw,16.64px)] ">
              {fromLabel}
            </p>
            <div className="flex items-baseline justify-center">
              <span className="text-[#2970b7] text-3xl sm:text-4xl font-bold text-[#2970b7] text-[clamp(0px,6.76vw,69.25px)] sm:text-[clamp(0px,2.76vw,69.25px)]  lg:text-[clamp(7.78px,1.86vw,35.84px)] font-bold">
                S/. {price}
              </span>
            </div>
            <p className="text-[#6a6a6a] text-sm text-[#6a6a6a] text-[clamp(0px,2.65vw,27.2px)] sm:text-[clamp(0px,1.15vw,27.2px)] lg:text-[clamp(3.03px,0.7vw,14.08px)]">
              {personDesc}
            </p>
          </div>

          <div className="flex gap-6 sm:gap-6 mb-4 sm:mb-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    {renderIcon(
                      unitData.iconMaxPassengers,
                      STATIC_FALLBACK.passengersIcon,
                      "w-[clamp(0px,4.33vw,44.2px)] sm:w-[clamp(0px,2.33vw,44.2px)] lg:w-[clamp(4.9px,1.2vw,23px)] h-auto",
                    )}
                    <span className="text-[#6a6a6a] text-[clamp(0px,2.65vw,27.20px)] sm:text-[clamp(0px,1.15vw,27.20px)] lg:text-[clamp(3.03px,0.7vw,14.08px)] ">
                      Hasta {maxPassengers}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Capacidad maxima de {maxPassengers} personas</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    {renderIcon(
                      unitData.iconDifficulty,
                      STATIC_FALLBACK.difficultyIcon,
                      "w-[clamp(0px,4.33vw,44.2px)] sm:w-[clamp(0px,2.33vw,44.2px)] lg:w-[clamp(4.9px,1.2vw,23px)] h-auto",
                    )}
                    <span className="text-[#6a6a6a] text-[clamp(0px,2.65vw,27.20px)] sm:text-[clamp(0px,1.15vw,27.20px)] lg:text-[clamp(3.03px,0.7vw,14.08px)] mt-1">
                      {trad[difficulty]}{" "}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nivel de dificultad {difficulty}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Link href={href} className="w-full flex justify-center">
          <Button className="w-fit h-fit bg-[#3eae64] hover:bg-[#35a058] text-white font-semibold  py-[clamp(0px,1.20vw,12.36px)] sm:py-[clamp(0px,0.70vw,12.36px)] lg:py-[clamp(1.38px,0.3vw,6.4px)] px-[clamp(0px,2.89vw,29.68px)]  sm:px-[clamp(0px,1.49vw,29.68px)] lg:px-[clamp(3.31px,0.8vw,15.36px)]  text-[clamp(0px,3.86vw,39.57px)] sm:text-[clamp(0px,1.86vw,39.57px)] lg:text-[clamp(4.4px,1vw,20.48px)] rounded-full cursor-pointer ">
            Ver Detalles
          </Button>
        </Link>
      </div>
    </Card>
  );
}
