import { DataTourBlock as DataTourBlockType, Media } from "@/cms-types";
import { Subtitle } from "@/components/Subtitle";
import SupportBannerBlock from "@/components/supportBanner";

interface Props extends DataTourBlockType {
  context?: {
    nameCollection: string
  } | null
}

export async function DataTourBlock(props: Props) {
  const { duration, difficulty, groupSize, altitud, idioma } = props
  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
      </div>
    </div>
  )
}
