import { AdicionalTourBlock, BeneficiosBlockType, Media } from "@/cms-types";
import { Faq } from "@/components/Faq";
import { Subtitle } from "@/components/Subtitle";
import SupportBannerBlock from "@/components/supportBanner";

interface Props extends AdicionalTourBlock {
  context?: {
    nameCollection: string
  } | null
}

export async function AdicionalBlock(props: Props) {
  const { arrayData } = props
  return (
    <div className="">
      {arrayData && <Faq tabs={arrayData} />}
    </div>
  )
}
