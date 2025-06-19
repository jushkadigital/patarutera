import Image from "next/image"

type image = {
    src:string,
    alt:string
}


interface Props {
    images: image[]
}

export  function GalleryCarousel({images}:Props) {
  // Array de imágenes de ejemplo (máximo 7)

  return (
    <div className="w-full  p-3 my-5">
      {/* Contenedor principal con flex row */}
      <div className="w-full flex flex-row gap-2 sm:gap-3 md:gap-4 justify-center ">
        {images.map((image, index) => (
          <div
            key={index}
            className="flex-1 min-w-0 max-w-36 aspect-square relative  rounded-lg transition-shadow duration-300"
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-contain hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 14vw, (max-width: 768px) 12vw, (max-width: 1024px) 10vw, 8vw"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
