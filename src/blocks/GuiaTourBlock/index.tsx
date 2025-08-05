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
        <div className="w-full md:mt-7 lg:mt-10">
            <Subtitle titleGroup={blockTitle}/>
            <div className="w-full md:mt-5 lg:mt-7">
                    <TabsViaje tabs={[sectionItinerario,sectionIncluyeNoIncluye,sectionPrecios,sectionInfoViaje].map((ele,idx)=>({
                        id: (idx),
                        label: ele.iconText,
                        icon: (ele.iconImage as Media).url!,
                        content: ele.contentSection
                    }))}/>
                 </div>
        </div>
    )
}
 