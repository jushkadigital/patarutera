import { BeneficiosBlockType, GuiaTourBlock, Media } from "@/cms-types";
import { Subtitle } from "@/components/Subtitle";
import SupportBannerBlock from "@/components/supportBanner";
import TabsViaje from "@/components/Tabs";

interface Props extends GuiaTourBlock {
  context?: {
    nameCollection: string
  } | null
}

export async function GuiaTour(props: Props) {
  const { blockTitle, sectionIncluyeNoIncluye, sectionInfoViaje, sectionItinerario, sectionPrecios, sectionFAQ } = props
  return (
    <div className="w-full md:mt-7 lg:mt-10">
      <Subtitle titleGroup={blockTitle} />
      <div className="w-full md:mt-5 lg:mt-7">
        <TabsViaje tabs={[sectionItinerario, sectionIncluyeNoIncluye, sectionPrecios, sectionInfoViaje, sectionFAQ].map((ele, idx) => {
          const content = (ele as any).contentSection || (ele as any).arrayData
          return ({
            id: (idx),
            label: ele.iconText,
            icon: (ele.iconImage as Media),
            content: content
          })
        }
        )} />
      </div>
    </div>
  )
}

