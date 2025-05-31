import Image from "next/image"
import Link from "next/link"

interface ComponentProps {
  color?: string
  price: number
  perPerson: string
  type: string
  title: string
  background: string
  slug: string
}

export  function OfertaCardComponent({ color = "#79368C",price , perPerson, type, title, background ,slug}: ComponentProps) {
  return (
    <div className=" flex items-center justify-end p-8 h-[400px]">
      <Link href={`/tours/${slug}`} className="relative w-[600px] h-[400px] rounded-3xl overflow-hidden">
        {/* Background Image */}
        <Image src={background} alt="Background" fill className="object-cover" priority />

        {/* Overlay */}
        <div className="absolute inset-0 opacity-60 z-10" style={{ backgroundColor: color }} />

        {/* Título en la izquierda - centrado verticalmente */}
        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 text-white font-bold z-20">
          <div className="text-sm uppercase tracking-wider opacity-90">{type}</div>
          <div className="text-3xl uppercase font-black mb-3">{title}</div>

          {/* Barra de colores */}
          <div className="flex h-1 w-32 rounded-full overflow-hidden">
            <div className="flex-1 bg-blue-500"></div>
            <div className="flex-1 bg-purple-500"></div>
            <div className="flex-1 bg-pink-500"></div>
            <div className="flex-1 bg-orange-500"></div>
            <div className="flex-1 bg-yellow-500"></div>
            <div className="flex-1 bg-green-500"></div>
            <div className="flex-1 bg-teal-500"></div>
          </div>
        </div>

        {/* Precio en la derecha */}
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 text-white font-bold z-20 flex items-baseline">
          <span className="text-sm">S/</span>
          <span className="text-4xl">{price}</span>
        </div>

        {/* Texto adicional del precio */}
        <div className="absolute top-1/2 right-8 transform translate-y-2 text-white text-xs opacity-80 z-20">
        {perPerson}
        </div>

        {/* SVG con ancho máximo de 200px */}
        <div className="absolute inset-0 flex items-center justify-end pr-4 z-10">
          <svg
            width="200"
            height="114"
            viewBox="0 0 351 201"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="max-w-[200px]"
          >
            <path
              d="M0.00491333 97.3629C26.4851 119.367 55.519 138.386 86.6057 153.899C146.977 184.046 215.063 201 287.103 201C308.79 201 330.123 199.461 351 196.491V0C273.357 63.8383 174.012 102.142 65.7045 102.142C43.3839 102.142 21.4464 100.51 0 97.3629H0.00491333Z"
              fill={color}
              fillOpacity="0.8"
            />
            <defs>
              <linearGradient
                id="paint0_linear_542_2306"
                x1="244.613"
                y1="-23.0611"
                x2="167.484"
                y2="166.19"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor={color} />
                <stop offset="1" stopColor={color} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </Link>
    </div>
  )
}
