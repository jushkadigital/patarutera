"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "@/components/PayloadImage"
import Link from "next/link"
import { Media } from "@/cms-types"


interface Props {
  backgroundImage: Media
  link: string
  text: string
}

export function ImageCuadroLink({ backgroundImage, link, text }: Props) {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Card container with border and rounded corners */}
      <div className="relative bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-2xl border border-gray-500 overflow-hidden shadow-xl">
        {/* Mountain background */}
        <Image
          media={backgroundImage}
          fill
          className="opacity-40"
        />

        {/* Content area */}
        <div className="relative p-6 h-64 flex items-center justify-center">
          {/* Hand holding the brochure */}
          <div className="relative">
          </div>
        </div>

        {/* Ver Revista button */}
        <div className="absolute bottom-4 left-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-white/10 text-sm font-semibold p-2"
          >
            <Link href={link} className=" flex items-center">
              {text}
              <ArrowRight/>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
