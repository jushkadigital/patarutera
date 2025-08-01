import { Media, SociosBlockType } from "@/cms-types";
import { CarouselConditional } from "@/components/CarouselConditional";
import { GalleryCarousel } from "@/components/galleryCarousel";
import InfiniteImageCarousel from "@/components/infinity-image-carousel";
import { Subtitle } from "@/components/Subtitle";
import { BASEURL } from "@/lib/config";

interface Props extends SociosBlockType {
context?: {
    nameCollection:string
  }| null
}

export async function SociosBlock(props:Props){
    const {blockTitle} = props

   const response = await fetch(`${BASEURL}/api/globals/sociosCarousel`)
    if (!response.ok) {
        // Consider logging the response status and text for more detailed error info
        // console.error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data.images && data.images.length > 0 ? 
    (<div>
        <Subtitle titleGroup={blockTitle}/>
        <CarouselConditional data={data}/>
    </div>) 
    :
     <div></div>
}
