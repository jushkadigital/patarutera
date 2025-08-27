import { TextContentBlockType } from "@/cms-types";
import RichText from "@/components/RichText";
import { Subtitle } from "@/components/Subtitle";
import { cn } from "@/lib/utils";

interface Props extends TextContentBlockType {
  context?: {
    nameCollection: string
  } | null
}

export async function TextContentBlock(props: Props) {
  console.log('textRender')
  const { blockTitle, description, descriptionAlignment } = props
  const classessDescription = cn(`text-${descriptionAlignment}`, `text-[20px]`)
  return (
    <div className="mt-10">

      <Subtitle titleGroup={blockTitle} className="pb-1!" />
      <div>
        <RichText data={description} className={classessDescription} />
      </div>
    </div>
  )
}
