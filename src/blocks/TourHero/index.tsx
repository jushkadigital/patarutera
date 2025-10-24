'use client'
import { Media, TourHerocarB } from "@/cms-types";
import { BannerCarousel } from "@/components/BannerCarousel";
import { Carousel } from "@/components/Carousel";
import { CarouselItem } from "@/components/ui/carousel";
import { BASEURL } from "@/lib/config";
import Image from "@/components/PayloadImage"
import { useMobile } from "@/hooks/useMobile";


interface Props extends TourHerocarB {

}
//return <div className="flex flex-col md:flex-row w-full md:px-[clamp(102px,10vw,192px)] md:mb-10">
export function TourHero(props: Props) {
  const { carContent, ImageContent } = props
  console.log('TOUR')

  const isMobile = useMobile()

  return isMobile
    ?
    <>
      <div className="mx-auto md:mx-0 w-[100%] md:w-[40%] flex flex-row justify-center items-center order-none mb-5">
        <Carousel className="">
          {carContent!.carImages!.map((item) => (
            <div className="w-[clamp(140px,53vw,840px)] h-[clamp(140px,53vw,840px)] relative rounded-2xl overflow-hidden">
              <Image media={(item.image as Media)} fill className="h-full w-full object-cover" />
            </div>
          ))}
        </Carousel>

      </div>
      <div className="md:w-[60%] flex flex-row justify-center items-center order-last md:order-none">
        <div className="h-[clamp(125px,32vw,614px)] w-[clamp(140px,43.3vw,832px)]  relative rounded-2xl overflow-hidden">
          <Image media={(ImageContent.image as Media)} fill className=" h-full w-full object-cover" />
        </div>
      </div>
    </>
    :
    <div className="flex flex-col md:flex-row w-full md:px-[clamp(102px,10vw,192px)] md:mb-10">
      <div className=" mx-auto md:mx-0 w-[100%] md:w-[40%] flex flex-row justify-center items-center order-none">
        <Carousel className="">
          {carContent!.carImages!.map((item) => (
            <div className="w-[clamp(140px,33vw,840px)] aspect-square relative rounded-2xl overflow-hidden">
              <Image media={(item.image as Media)} fill className="h-full w-full object-cover" />
            </div>
          ))}
        </Carousel>

      </div>
      <div className="md:w-[60%] flex flex-row justify-center items-center order-last md:order-none">
        <div className="w-[clamp(140px,43.3vw,832px)] aspect-[4/3] relative rounded-2xl overflow-hidden">
          <Image media={(ImageContent.image as Media)} fill className="h-full w-full object-cover" />
        </div>
      </div>
    </div>

} 
