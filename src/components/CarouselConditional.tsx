'use client'
import InfiniteImageCarousel from "@/components/infinity-image-carousel";
import { useMobile } from "@/hooks/useMobile"
import { GalleryCarousel } from "./galleryCarousel"
import { Media } from "@/cms-types";


export function CarouselConditional(props){
    const data = props.data
    const isMobile = useMobile()
    return isMobile ? (<InfiniteImageCarousel images={data.images.map((ele)=>({src:(ele.image as Media)}))}/>):(<GalleryCarousel images={data.images.map((ele)=>({src:(ele.image as Media)}))}/>)
}