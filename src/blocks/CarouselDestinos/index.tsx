import { CarouselDestinationBlock } from "@/cms-types";
import CarouselDestinosComponent from "@/components/Carousel2Destinos";
import { BASEURL } from "@/lib/config";
type Props = CarouselDestinationBlock

export async function CarouselDestinos(props: Props) {


  const titleObj = props.title

  const response = await fetch(`${BASEURL}/api/destinations?limit=100&depth=1&sort=createdAt`)
  const data = await response.json()


  const dataMap = data.docs.map((doc: any) => ({
    title: doc.name,
    button: "Ver Destino",
    src:  doc.imageDestination.url,
    bgImage:  doc.backgroundDestination.url,
  }))
  const slideData = [
  ]
  return <div className="w-full overflow-hidden h-full">
    <CarouselDestinosComponent slides={dataMap}/>
  </div>
} 