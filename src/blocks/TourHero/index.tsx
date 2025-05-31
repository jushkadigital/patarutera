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
  return <div className="flex flex-row w-full">
    <div className="w-1/2 flex flex-row justify-center items-center">

    <Carousel className="h-[400px]">
      {carContent!.carImages!.map((item) => (
        <Image alt="o"  src={(item.image as Media).url!} width={300}  height={350} className=" object-cover"/>
      ))}
    </Carousel>
    
    </div>
    <div className="w-1/2 flex flex-row justify-center items-center">
      <div className="h-[400px] w-[300px] relative overflow-hidden">
        
        <Image alt="o"  src={(ImageContent.image as Media).url!} fill className="object-cover"/>
      </div>
    </div>
  </div>
} 