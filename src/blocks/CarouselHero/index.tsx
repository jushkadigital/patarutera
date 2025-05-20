import { CarouselHeroPage } from "@/cms-types";
import { BannerCarousel } from "@/components/BannerCarousel";
import { Carousel } from "@/components/Carousel";
import { CarouselItem } from "@/components/ui/carousel";
import { BASEURL } from "@/lib/config";
type Props = CarouselHeroPage

export async function CarouselHero(props: Props) {
  console.log('HERE')

  const response = await fetch(`${BASEURL}/api/destinations?limit=100&depth=1&sort=createdAt`)
  const data = await response.json()
  return <div>
    <Carousel>
      {data.docs.map((item: any) => (
        <BannerCarousel key={item.id} title={item.name} backgroundUrl={item.carouselItemDestination.url} alt={item.carouselItemDestination.alt}/>
      ))}
    </Carousel>
  </div>
} 