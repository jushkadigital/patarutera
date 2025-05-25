import { SociosBlockType } from "@/cms-types";
import InfiniteImageCarousel from "@/components/infinity-image-carousel";

interface Props extends SociosBlockType {

}
const images = [
  {
    src: "/placeholder.svg?height=200&width=300&query=beautiful landscape mountain view",
    alt: "Mountain Landscape",
  },
  {
    src: "/placeholder.svg?height=200&width=300&query=ocean sunset beach waves",
    alt: "Ocean Sunset",
  },
  {
    src: "/placeholder.svg?height=200&width=300&query=forest trees nature green",
    alt: "Forest Path",
  },
  {
    src: "/placeholder.svg?height=200&width=300&query=city skyline night lights",
    alt: "City Skyline",
  },
  {
    src: "/placeholder.svg?height=200&width=300&query=desert sand dunes golden hour",
    alt: "Desert Dunes",
  },
  {
    src: "/placeholder.svg?height=200&width=300&query=waterfall rocks tropical nature",
    alt: "Tropical Waterfall",
  },
  {
    src: "/placeholder.svg?height=200&width=300&query=cherry blossoms spring pink",
    alt: "Cherry Blossoms",
  },
  {
    src: "/placeholder.svg?height=200&width=300&query=northern lights aurora sky",
    alt: "Northern Lights",
  },
]

export async function SociosBlock(props:Props){
    const {socios} = props


    return socios && socios.length > 0 ? 
    (<div>
        <InfiniteImageCarousel images={images}/>
    </div>) 
    :
     <div></div>
}
