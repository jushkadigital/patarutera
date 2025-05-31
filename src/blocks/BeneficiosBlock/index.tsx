import { BeneficiosBlockType, Media } from "@/cms-types";
import { Subtitle } from "@/components/Subtitle";
import SupportBannerBlock from "@/components/supportBanner";

interface Props extends BeneficiosBlockType {

}

export async function BeneficiosBlock(props:Props){
    const {blockTitle,beneficios,colorItem} = props
    return(
        <div className="">
            <Subtitle titleGroup={blockTitle}/>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {beneficios?.map(ele=>(
                    <SupportBannerBlock key={ele.id} text={ele.beneficioText} imgUrl={ele.beneficioImage ? (ele.beneficioImage as Media).url: null} colorBanner={colorItem}/>
                ))}
            </div>
        </div>
    )
}