import { Media, SociosBlockType } from "@/cms-types";
import InfiniteImageCarousel from "@/components/infinity-image-carousel";
import { Subtitle } from "@/components/Subtitle";

interface Props extends SociosBlockType {

}

export async function SociosBlock(props:Props){
    const {socios,blockTitle} = props


    return socios && socios.length > 0 ? 
    (<div>
        <Subtitle titleGroup={blockTitle}/>
        <InfiniteImageCarousel images={socios.map((ele)=>({src:(ele.image as Media).url!,alt: 'image'}))}/>
    </div>) 
    :
     <div></div>
}
