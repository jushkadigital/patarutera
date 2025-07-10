import { CarouselHeroPage } from "@/cms-types";
import { BannerCarousel } from "@/components/BannerCarousel";
import { Carousel } from "@/components/Carousel";
import { TourSearchBoxHorizontal } from "@/components/leftPanelSearch";
import { CarouselItem } from "@/components/ui/carousel";
import { BASEURL } from "@/lib/config";
interface Props extends CarouselHeroPage{

}

export async function CarouselHero(props: Props) {
  console.log('HERE')
  const destinationsRequest = await fetch(`${BASEURL}/api/destinations`)
  const destinationsData = await destinationsRequest.json()
  const destinations = destinationsData.docs

  const response = await fetch(`${BASEURL}/api/destinations?limit=100&depth=1&sort=createdAt`)
  const data = await response.json()
  return <div className="relative w-full">
    <Carousel>
      {data.docs.map((item: any) => (
        <BannerCarousel key={item.id} title={item.name} backgroundUrl={item.carouselItemDestination.url} alt={item.carouselItemDestination.alt}/>
      ))}
    </Carousel>
    <div className="absolute bottom-20 w-full flex justify-center">
      <TourSearchBoxHorizontal destinations={destinations}/>
    </div>
    <div className="h-4 w-full grid grid-cols-4 relative">
        <div className="bg-blue-600"></div>
        <div className="bg-[#3eae64]"></div>
        <div className="bg-yellow-500"></div>
        <div className="bg-purple-600"></div>
      </div>
  </div>
} 