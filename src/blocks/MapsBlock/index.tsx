import { MapBlockType, Media } from "@/cms-types";
import { Subtitle } from "@/components/Subtitle";
import SupportBannerBlock from "@/components/supportBanner";
import Image from "@/components/PayloadImage"
import { FullscreenImage } from "@/components/FullScreeImage";

interface Props extends MapBlockType {
  context?: {
    nameCollection: string
  } | null
}

export async function MapsBlock(props: Props) {
  const { blockTitle, ImageContent } = props
  return (
    <div className="">
      <Subtitle titleGroup={blockTitle} />
      <div>
        <div className="flex flex-row justify-center items-center ">
          <FullscreenImage src={(ImageContent.image as Media).url!} alt="eu" />
        </div>
      </div>
    </div>
  )
}
