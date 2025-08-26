'use client'
import { Media } from "@/cms-types"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"
import Image from "next/image"

interface Props {
  text: string
  imgUrl: string
  title: string
  className: string
}

const imageObj = {
  duration: '/durationData.svg',
  groupSize: '/groupSizeData.svg',
  difficulty: '/difficultyData.svg',
  altitud: '/altitudData.svg',
  idioma: '/IdiomaData.svg'
}


export default function DataTourBanner({ text, title, imgUrl, className }: Props) {

  return (
    <div className={cn('flex flex-row gap-x-4 border rounded-2xl md:border-none md:rounded-none py-3 px-2', className)}>
      <div className="relative max-w-[30%] min-w-10 flex justify-center items-center">
        <Image src={imageObj[imgUrl]} alt={`logo ${title}`} fill className="object-contain" />
      </div>
      <div className="w-[60%] flex flex-col">
        <div className="text-[#2970B7] md:text-[14px]">{title}</div>
        <div className="text-[#6A6A6A] md:text-[14px]">{text}</div>
      </div>
    </div>
  )
}
