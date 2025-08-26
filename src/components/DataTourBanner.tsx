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
  difficulty: '/difficulty.svg',
  altitud: '/altitudData.svg',
  idioma: '/idiomaData.svg'
}


export default function SupportBannerBlock({ text, title, imgUrl, className }: Props) {

  const classessLine = cn('w-1', 'h-12', `bg-[var(--bg-color)]`, 'rounded-full')
  return (
    <div className={cn('flex flex-row', className)}>
      <div className="relative">
        <Image src={imageObj[imgUrl]} alt={`logo ${title}`} fill className="object-cover" />
      </div>
      <div className="w-[70%]">
        <div>{title}</div>
        <div>{text}</div>
      </div>
    </div>
  )
}
