import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/footer1.png"
          alt="Peruvian landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#2d3e3a]/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-[#3eae64] text-xl font-medium mb-6">INFORMACIÓN DE CONTACTO</h3>
            <div className="space-y-4">
              <p>+51 930 770 103</p>
              <p>ventas@patarutera.com</p>
              <p>Av. Tacna 168 Wánchaq - Cusco</p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-[#3eae64] text-xl font-medium mb-6">HORARIO</h3>
            <div className="space-y-4">
              <p>Lunes a Viernes: 8:00 - 20:00</p>
              <p>Sábados: 8:00 - 18:30</p>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-[#3eae64] text-xl font-medium mb-6">DESTINOS</h3>
            <div className="space-y-4">
              <Link href="#" className="block hover:underline">
                Cusco
              </Link>
              <Link href="#" className="block hover:underline">
                Lima
              </Link>
              <Link href="#" className="block hover:underline">
                Arequipa
              </Link>
              <Link href="#" className="block hover:underline">
                Madre de Dios
              </Link>
              <Link href="#" className="block hover:underline">
                Ica
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Colorful Bottom Border */}
      <div className="h-2 w-full grid grid-cols-4">
        <div className="bg-blue-600"></div>
        <div className="bg-[#3eae64]"></div>
        <div className="bg-yellow-500"></div>
        <div className="bg-purple-600"></div>
      </div>
    </footer>
  )
}
