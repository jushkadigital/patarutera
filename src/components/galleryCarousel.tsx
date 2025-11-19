import { Media } from "@/cms-types"
import Image from "@/components/PayloadImage"

type image = {
  src: Media,
}


interface Props {
  images: image[]
}

export function GalleryCarousel({ images }: Props) {
  // Array de imágenes de ejemplo (máximo 7)

  return (
    <div className="w-full  p-3 my-5">
      {/* Contenedor principal con flex row */}
      <div className="w-full flex flex-row gap-4 sm:gap-6 md:gap-15 justify-center ">
        {images.map((image, index) => (
          <div
            key={index}
            className="flex-1 min-w-0 max-w-36 aspect-square relative  rounded-lg transition-shadow duration-300"
          >
            <Image
              media={image.src}
              fill
              className="object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
