import { cn } from "@/lib/utils"
import { User } from "lucide-react"

interface Props{
text: string 
imgUrl?: string | null
colorBanner?: string
}
export default function SupportBannerBlock({text,colorBanner}:Props) {

    const classessLine = cn('w-1','h-12',`bg-[${colorBanner}]`,'rounded-full')
  return (
    <div className="flex items-center justify-center  bg-gray-50 p-4">
      <div className="bg-[#ffffff] rounded-3xl shadow-lg border border-[#e2e2e2] p-6 w-full max-w-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={classessLine}></div>
            <h2 className="text-[#898989] text-xl font-medium">{text}</h2>
          </div>
          <div className="w-12 h-12 bg-[#d5d5d5] rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-[#898989]" />
          </div>
        </div>
      </div>
    </div>
  )
}
