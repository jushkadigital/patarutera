'use client'
import { Media } from "@/cms-types"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"
import Image from "next/image"

interface Props{
text: string 
imgUrl: Media | null | number | undefined
colorBanner?: string
}
export default function SupportBannerBlock({text,colorBanner,imgUrl}:Props) {

  const dynamicStyles = {
    "--bg-color": colorBanner || 'currentColor', // 'currentColor' es un buen fallback
  } as React.CSSProperties;


    const classessLine = cn('w-1','h-12',`bg-[var(--bg-color)]`,'rounded-full')
  return (
    <div className=" flex items-center justify-center  bg-gray-50 p-4" style={dynamicStyles}>
      <div className="h-[100px] group p-6 rounded-lg shadow-lg bg-white transition-colors duration-300
                    hover:bg-blue-500 bg-[#ffffff] rounded-3xl shadow-lg border border-[#e2e2e2] p-6 w-full max-w-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={classessLine}></div>
            <h2 className="text-[#898989] text-xl font-medium mt-0  text-lg font-semibold transition-colors duration-300
                      group-hover:text-white max-w-44 align-top">{text}</h2>
          </div>
          <div className="w-12 h-12 flex items-center justify-center">
            { imgUrl ? <Image src={(imgUrl as Media).url || "/placeholder.svg"} alt={(imgUrl as Media).alt || 'img'} width={100}  height={100} className="transition-filter duration-100
                     group-hover:filter group-hover:brightness-0 group-hover:invert"/>:<User className="w-6 h-6 text-[#898989]" />}
          </div>
        </div>
      </div>
    </div>
  )
}
