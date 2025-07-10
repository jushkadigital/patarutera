import { Media, TourHerocarB } from "@/cms-types";
import { BannerCarousel } from "@/components/BannerCarousel";
import { Carousel } from "@/components/Carousel";
import { CarouselItem } from "@/components/ui/carousel";
import { BASEURL } from "@/lib/config";
import Image from "next/image"

interface Props extends TourHerocarB{

}

export async function TourHero(props: Props) {
    const {carContent,ImageContent} = props
    console.log('TOUR')
  return <div className="flex flex-col lg:flex-row w-full lg:px-[220px] lg:mb-10">
    <div className="lg:w-1/3 flex flex-row justify-center items-center">
    <Carousel className="">
      {carContent!.carImages!.map((item) => (
        <div className="w-[450px] h-[450px] relative rounded-2xl overflow-hidden">
        <Image alt="o"  src={(item.image as Media).url!} fill className="h-full w-full object-cover"/>
        </div>
      ))}
    </Carousel>
    
    </div>
    <div className="lg:w-2/3 flex flex-row justify-center items-center ">
      <div className="h-[450px] w-[90%] max-w-[700px] mx-auto relative rounded-2xl overflow-hidden">
        <Image alt="o" src={(ImageContent.image as Media).url!} fill className=" h-full w-full object-cover"/>
      </div>
    </div>
  </div>
} 