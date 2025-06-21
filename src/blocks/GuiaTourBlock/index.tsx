import { BeneficiosBlockType, GuiaTourBlock, Media } from "@/cms-types";
import { Subtitle } from "@/components/Subtitle";
import SupportBannerBlock from "@/components/supportBanner";
import TabsViaje from "@/components/Tabs";

interface Props extends GuiaTourBlock {
context?: {
    nameCollection:string
  }| null
}

export async function GuiaTour(props:Props){
    const {blockTitle,sectionIncluyeNoIncluye,sectionInfoViaje,sectionItinerario,sectionPrecios} = props
    return(
        <div className="w-full">
            <Subtitle titleGroup={blockTitle}/>
            <div className="w-full">
                    <TabsViaje tabs={[sectionIncluyeNoIncluye,sectionIncluyeNoIncluye,sectionInfoViaje,sectionItinerario,sectionPrecios].map((ele,idx)=>({
                        id: String(idx),
                        label: ele.iconText,
                        icon: (ele.iconImage as Media).url!,
                        content: ele.contentSection
                    }))}/>
                 </div>
        </div>
    )
}
 