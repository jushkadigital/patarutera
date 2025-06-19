import Link from "next/link"
import { Phone, Mail, MapPin, ChevronRight } from "lucide-react"

// Mapeo de iconos disponibles
const iconMap = {
  Phone,
  Mail,
  MapPin,
  ChevronRight,
}

export const FooterColumns = ({ columns }) => {
  const renderLink = (linkData) => {
    const { link } = linkData
    const IconComponent = link.icon ? iconMap[link.icon] : null

    switch (link.type) {
      case "text":
        // Tipo texto: solo muestra información sin enlace
        return (
          <div className="flex items-center space-x-2 text-gray-300">
            {IconComponent && <IconComponent className="w-4 h-4 flex-shrink-0" />}
            <span>{link.textInfo}</span>
          </div>
        )

      case "custom":
        // Tipo custom: enlace personalizado
        return (
          <Link
            href={`/${link.url}`}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
            target={link.newTab ? "_blank" : undefined}
            rel={link.newTab ? "noopener noreferrer" : undefined}
          >
            {IconComponent && <IconComponent className="w-4 h-4 flex-shrink-0" />}
            <span>{link.label}</span>
          </Link>
        )

      case "reference":
        // Tipo reference: enlace a contenido referenciado
        const slugType = link.reference?.relationTo
        const slug = link.reference?.value?.slug
        const label = link.label || link.reference?.value?.title

        return (
          <Link
            href={`/${slugType}/${slug}`}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
            target={link.newTab ? "_blank" : undefined}
            rel={link.newTab ? "noopener noreferrer" : undefined}
          >
            {IconComponent && <IconComponent className="w-4 h-4 flex-shrink-0" />}
            <span>{label}</span>
          </Link>
        )

      default:
        return null
    }
  }

  return (
      <div className="container mx-auto ">
          {/* Logo y descripción - Izquierda */}
          {/* Grid de columnas - Derecha */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {columns.map((column) => (
                <div key={column.id} className="space-y-4">
                  <h3 className="font-semibold text-lg mb-4 text-white">{column.nameColumn}</h3>
                  <ul className="space-y-3">
                    {column.links.map((linkItem) => (
                      <li key={linkItem.id}>{renderLink(linkItem)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

        {/* Línea divisoria y copyright */}
      </div>
  )
}

// Componente principal que usa FooterColumns
export default function Component() {
  const footerData = [
    {
      id: "68518570dfdc1679a6aeaff9",
      nameColumn: "INFORMACIÓN DE CONTACTO",
      links: [
        {
          id: "68518575dfdc1679a6aeaffb",
          link: {
            type: "text",
            newTab: null,
            url: null,
            textInfo: "+51 930 770 103",
            label: null,
            icon: "Phone",
          },
        },
        {
          id: "68518584dfdc1679a6aeaffd",
          link: {
            type: "text",
            newTab: null,
            url: null,
            textInfo: "ventas@patarutera.com",
            label: null,
            icon: "Mail",
          },
        },
        {
          id: "685185a5dfdc1679a6aeafff",
          link: {
            type: "text",
            newTab: null,
            url: null,
            textInfo: "Av. Tacna 168 Wánchaq - Cusco",
            label: null,
            icon: "MapPin",
          },
        },
      ],
    },
    {
      id: "685185b9dfdc1679a6aeb001",
      nameColumn: "Destinos",
      links: [
        {
          id: "685185d2dfdc1679a6aeb003",
          link: {
            type: "custom",
            newTab: null,
            url: "destinos?destination=Cusco&categories=",
            textInfo: null,
            label: "Cusco",
            icon: "ChevronRight",
          },
        },
        {
          id: "685186bddfdc1679a6aeb005",
          link: {
            type: "custom",
            newTab: null,
            url: "destinos?destination=Ica&categories=",
            textInfo: null,
            label: "Ica",
            icon: "ChevronRight",
          },
        },
        {
          id: "685186d2dfdc1679a6aeb007",
          link: {
            type: "custom",
            newTab: null,
            url: "destinos?destination=Puerto%20Maldonado&categories=",
            textInfo: null,
            label: "Puerto Maldonado",
            icon: "ChevronRight",
          },
        },
      ],
    },
    {
      id: "68518797dfdc1679a6aeb009",
      nameColumn: "Horarios",
      links: [
        {
          id: "6851879fdfdc1679a6aeb00b",
          link: {
            type: "reference",
            newTab: null,
            reference: {
              relationTo: "tours",
              value: {
                id: 1,
                title: "Tour Valle Sagrado",
                slug: "tour-valle-sagrado",
              },
            },
            url: null,
            textInfo: null,
            label: "Pagina Prueba",
            icon: null,
          },
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenido principal de ejemplo */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Patarutera Tours</h1>
          <p className="text-xl text-gray-600 mb-8">Descubre los mejores destinos del Perú</p>
          <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-lg">Contenido de la página</span>
          </div>
        </div>
      </main>

      {/* Footer con logo y columnas */}
      <FooterColumns columns={footerData} />
    </div>
  )
}
