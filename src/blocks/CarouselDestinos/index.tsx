import { CarouselDestinationBlock, Media } from "@/cms-types";
import CarouselDestinosComponent from "@/components/Carousel2Destinos";
import { BASEURL } from "@/lib/config";
type Props = CarouselDestinationBlock


type ItemDestination = {
  title: string,
  button: string,
  src: Media,
  bgImage: Media
}

export async function CarouselDestinos(props: Props) {


  const titleObj = props.title

  const response = await fetch(`${BASEURL}/api/destinations?limit=100&depth=1&sort=createdAt`)
  const data = await response.json()


  const dataMap:ItemDestination[] = data.docs.map((doc: any) => {
    /*if(!doc.imageDestination && !doc.backgroundDestination){
return ({
    title: doc.name,
    button: "Ver Destino",
    src: '/placeholder.svg',
    bgImage:  '/placeholder.svg',
  })

    }
    if(!doc.imageDestination){
      return ({
    title: doc.name,
    button: "Ver Destino",
    src: '/placeholder.svg',
    bgImage:  doc.backgroundDestination.url,
  })
  
    }
    if(!doc.backgroundDestination){
      return ({
    title: doc.name,
    button: "Ver Destino",
    src:  doc.imageDestination.url,
    bgImage:  '/placeholder.svg',
  })
  
    }*/
    return({
    title: doc.name,
    button: "Ver Destino",
    src:  doc.imageDestination,
    bgImage:  doc.backgroundDestination,
  })})
  
  return <div className="w-full overflow-hidden ">
    <CarouselDestinosComponent slides={[...dataMap]} titleObj={titleObj}/>
  </div>
} 