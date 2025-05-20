import { CarouselDestinationBlock } from "@/cms-types";
import CarouselDestinosComponent from "@/components/CarouselDestinos";
import { BASEURL } from "@/lib/config";
type Props = CarouselDestinationBlock

export async function CarouselDestinos(props: Props) {

  const response = await fetch(`${BASEURL}/api/destinations?limit=100&depth=1&sort=createdAt`)
  const data = await response.json()

  const dataMap = data.docs.map((doc: any) => ({
    title: doc.name,
    button: "Ver Destino",
    src:  doc.imageDestination.url,
    bgImage:  doc.backgroundDestination.url,
  }))
  const slideData = [
    {
      title: "Mystic Mountains",
      button: "Ver Destino",
      src: "https://images.unsplash.com/photo-1494806812796-244fe51b774d?q=80&w=3534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      bgImage:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Urban Dreams",
      button: "Explore Component",
      src: "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      bgImage:
        "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=3244&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Neon Nights",
      button: "Explore Component",
      src: "https://images.unsplash.com/photo-1590041794748-2d8eb73a571c?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      bgImage:
        "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Desert Whispers",
      button: "Explore Component",
      src: "https://images.unsplash.com/photo-1679420437432-80cfbf88986c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      bgImage:
        "https://images.unsplash.com/photo-1682686581580-d99b0230064e?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ]
  return <div className=" overflow-hidden w-full h-full py-20">
    <CarouselDestinosComponent slides={dataMap} />
  </div>
} 