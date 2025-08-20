import { Media, TourHerocarB } from "@/cms-types";
import { BannerCarousel } from "@/components/BannerCarousel";
import { Carousel } from "@/components/Carousel";
import { CarouselItem } from "@/components/ui/carousel";
import { BASEURL } from "@/lib/config";
import Image from "@/components/PayloadImage"


interface Props extends TourHerocarB{

}

export async function TourHero(props: Props) {
    const {carContent,ImageContent} = props
    console.log('TOUR')
  return <div className="flex flex-col md:flex-row w-full md:px-[clamp(102px,10vw,192px)] md:mb-10">
    <div className="mx-auto md:mx-0 w-[40%] md:w-[40%] flex flex-row justify-center items-center">
    <Carousel className="">
      {carContent!.carImages!.map((item) => (
        <div className="w-[clamp(140px,33vw,640px)] h-[clamp(140px,33vw,640px)] relative rounded-2xl overflow-hidden">
        <Image   media={(item.image as Media)} fill className="h-full w-full object-cover"/>
        </div>
      ))}
    </Carousel>
    
    </div>
    <div className="md:w-[60%] flex flex-row justify-center items-center ">
      <div className="h-[clamp(125px,32vw,614px)] w-[clamp(140px,43.3vw,832px)]  relative rounded-2xl overflow-hidden">
        <Image  media={(ImageContent.image as Media)} fill className=" h-full w-full object-cover"/>
      </div>
    </div>
  </div>
} 