import { TitleGroup } from "@/cms-types"
import { cn } from "@/lib/utils"

interface SubtitleProps {
  className?: string
  titleGroup: TitleGroup
}

export const Subtitle = ({ titleGroup, className = "" }:SubtitleProps)=>{

    const textSize = {'small': 'text-sm','medium': 'text-base','large':'text-xl','xlarge':'text-2xl'}
    const classesSubrayado = cn('mt-2','h-1','w-16',`bg-[${titleGroup.underlineColor!.toLocaleLowerCase()}]`)
    const classesText = cn('text-center','text-2xl','font-semibold','md:text-3xl',`text-[${titleGroup.textColor?.toLocaleLowerCase()}]`,textSize[titleGroup.size],className)
    const Tag:any = (titleGroup.tag.toLowerCase()) 
    return (
    <div className="w-full py-6 z-50 relative">
      <div className="flex flex-col items-center justify-center">
        <Tag className={classesText}>{titleGroup.titleText}</Tag>
        <div className={classesSubrayado} aria-hidden="true" />
      </div>
    </div>       
    )
}