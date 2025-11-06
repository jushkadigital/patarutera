"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "@/components/PayloadImage"

import Link from "next/link"
import { Media, Post } from "@/cms-types"
import { Button } from "@/components/ui/button"
import RichText from "./RichText"

// Se define el tipo de datos para el post, incluyendo el 'slug' para la URL
export type CardPostData = Pick<Post, 'id' | 'title' | 'slug' | 'description' | 'featuredImage'>

interface CardPostProps {
  unitData: CardPostData
  mode?: "grid" | "list"
}

export default function CardPost({ unitData, mode = "list" }: CardPostProps) {

  // MODO GRID: Ideal para mostrar varias tarjetas en una cuadrícula
  if (mode === "grid") {
    return (
      <Card className="w-full max-w-sm mx-auto overflow-hidden rounded-3xl shadow-lg flex flex-col group hover:shadow-2xl transition-all duration-500 hover:shadow-blue-500/25">
        {/* Sección de la Imagen */}
        <Link href={`/posts/${unitData.slug}`} className="block h-56">
          <div className="relative h-full w-full overflow-hidden">
            <Image
              media={unitData.featuredImage as Media}
              className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-2"
              fill
            />
            {/* Efecto de brillo que se mueve */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          </div>
        </Link>

        {/* Sección del Contenido */}
        <CardContent className="p-6 flex flex-col flex-grow">
          {/* Título */}
          <Link href={`/posts/${unitData.slug}`}>
            <h2 className="text-xl font-bold text-[#2970b7] leading-tight multi-line-truncate multi-line-truncate-2 mb-2 h-14">
              {unitData.title}
            </h2>
          </Link>

          {/* Descripción corta */}
          <div className="text-[#6a6a6a] flex-grow">
            <RichText
              data={unitData.description}
              enableGutter={false}
              className="prose-custom-lg multi-line-truncate multi-line-truncate-3"
            />
          </div>

          {/* Botón */}
          <div className="mt-4 flex justify-end">
            <Link href={`/posts/${unitData.slug}`}>
              <Button className="bg-[#3eae64] hover:bg-[#35a058] text-white font-semibold py-2 px-5 rounded-full text-base">
                Leer Más
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  } else {
    // MODO LISTA: Ideal para una vista de lista o más compacta
    return (
      <Card className="overflow-hidden shadow-lg w-full rounded-3xl flex flex-col md:flex-row md:h-64 group hover:shadow-2xl transition-all duration-500 hover:shadow-blue-500/25">
        {/* Sección de la Imagen */}
        <Link href={`/posts/${unitData.slug}`} className="w-full md:w-1/3 block h-56 md:h-full">
          <div className="relative h-full w-full overflow-hidden">
            <Image
              media={(unitData.featuredImage as Media)}
              className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-2"
              fill
            />
            {/* Efecto de brillo */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          </div>
        </Link>

        {/* Sección del Contenido */}
        <div className="w-full md:w-2/3 p-6 flex flex-col">
          <Link href={`/posts/${unitData.slug}`}>
            <h2 className="text-2xl font-bold text-[#2970b7] leading-tight mb-2 multi-line-truncate multi-line-truncate-2">
              {unitData.title}
            </h2>
          </Link>

          <div className="text-[#6a6a6a] flex-grow mb-4">
            <RichText
              data={unitData.description}
              enableGutter={false}
              className="prose-custom-lg multi-line-truncate multi-line-truncate-4"
            />
          </div>

          <div className="mt-auto flex justify-end">
            <Link href={`/posts/${unitData.slug}`}>
              <Button className="bg-[#3eae64] hover:bg-[#35a058] text-white font-semibold py-2 px-5 rounded-full text-base">
                Leer Más
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    )
  }
}
