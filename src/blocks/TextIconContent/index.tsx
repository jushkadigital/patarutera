import { Media, TxtIconContentBlockType } from "@/cms-types";
import RichText from "@/components/RichText";
import { Subtitle } from "@/components/Subtitle";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props extends TxtIconContentBlockType {
  context?: {
    nameCollection: string
  } | null
}

export async function TextIconContentBlock(props: Props) {
  console.log('textRender')
  const { iconImage, blockTitle, description, descriptionAlignment } = props
  const classessDescription = cn(`text-${descriptionAlignment}`, `py-0!`)
  return (
    <div className="mt-10">
      <div className="flex justify-center">
        <Image src={(iconImage as Media).url || '/placeholder.svg'} alt={(iconImage as Media).alt || 'gaa'} width={30} height={30} className="object-contain" />
      </div>
      <Subtitle titleGroup={blockTitle} className="pb-1!" />
      <div>
        <RichText data={description} className={classessDescription} />
      </div>
    </div>
  )
}
