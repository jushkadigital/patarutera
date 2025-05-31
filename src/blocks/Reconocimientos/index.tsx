import { Media, ReconocimientosBlockType } from "@/cms-types";
import InfiniteImageCarousel from "@/components/infinity-image-carousel";
import { Subtitle } from "@/components/Subtitle";

interface Props extends ReconocimientosBlockType {

}

export async function ReconocimientosBlock(props:Props){
    const {reconocimientos,blockTitle} = props

    return reconocimientos && reconocimientos.length > 0 ? 
    (<div>
        <Subtitle titleGroup={blockTitle}/>
        <InfiniteImageCarousel images={reconocimientos.map((ele)=>({src:(ele.image as Media).url!,alt: 'image'}))}/>
    </div>) 
    :
     <div></div>
}
