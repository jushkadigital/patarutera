'use client'
import Image from "next/image"
interface Props {
    images: {src: string,alt:string}[]
}
export default function InfiniteImageCarousel({images}:Props) {
  // Duplicamos las imágenes para crear el efecto infinito
  const duplicatedImages = [...images, ...images]

  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center p-8">

      <div className="w-full max-w-7xl overflow-hidden relative">
        {/* Gradientes para el efecto de fade */}
        <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900 z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900 z-10 pointer-events-none" />

        <div
          className="flex gap-6 py-4 animate-scroll-right"
          style={{
            width: `${duplicatedImages.length * 318}px`, // 300px width + 18px gap
          }}
        >
          {duplicatedImages.map((item, idx) => (
            <div
              key={`${item.alt}-${idx}`}
              className="relative w-[200px] flex-shrink-0 rounded-2xl  overflow-hidden "
            >
              <Image
                src={item.src || "/placeholder.svg"}
                alt={item.alt}
                width={100}
                height={50}
                className="w-full h-full object-contain aspect-square "
                priority={idx < 8} // Prioriza las primeras 8 imágenes
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-right {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-${images.length * 318}px);
          }
        }
        
        .animate-scroll-right {
          animation: scroll-right 40s linear infinite;
        }
      `}</style>
    </div>
  )
}
