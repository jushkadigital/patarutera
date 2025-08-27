import { TitleGroup } from "@/cms-types"
import { cn } from "@/lib/utils"

interface SubtitleProps {
  className?: string
  titleGroup: TitleGroup
}

export const Subtitle = ({ titleGroup, className = "" }: SubtitleProps) => {
  const dynamicStyles = {
    "--text-color": titleGroup.textColor?.toLowerCase() || 'currentColor', // 'currentColor' es un buen fallback
    "--underline-color": titleGroup.underlineColor?.toLowerCase() || 'transparent', // 'transparent' como fallback
  } as React.CSSProperties;

  const textSize = { 'small': 'text-sm', 'medium': 'text-2xl lg:text-3xl', 'large': 'text-xl lg:text-2xl', 'xlarge': 'text-2xl lg:text-3xl' }
  const classesSubrayado = cn('mt-2', 'h-1', 'w-16', `bg-[var(--underline-color)]`)
  const classesText = cn('text-center', 'font-semibold', `text-[var(--text-color)]`, 'text-[clamp(18px,2vw,28px)]')
  const Tag: any = (titleGroup.tag.toLowerCase())
  return titleGroup.titleText.trim() != "" ? <div className={`w-full pb-6 z-50 relative ${className}`} style={dynamicStyles}>
    <div className={`flex flex-col items-center justify-center `}>
      <Tag className={classesText}>{titleGroup.titleText}</Tag>

      <div className={classesSubrayado} aria-hidden="true" />
    </div>
  </div>
    : <div></div>

}
