import Image from "next/image"
interface Props {
    images: {src: string,alt:string}[]
}
export default function InfiniteImageCarousel({images}:Props) {
  // Duplicamos las imágenes para crear el efecto infinito
  const duplicatedImages = [...images, ...images]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-200">Infinite Image Carousel</h1>

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
              className="relative w-[300px] h-[200px] flex-shrink-0 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <Image
                src={item.src || "/placeholder.svg"}
                alt={item.alt}
                width={300}
                height={200}
                className="w-full h-full object-cover"
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
