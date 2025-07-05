"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { MapPin, CheckCircle, Tag, Info, ListTodo } from "lucide-react"
import RichText from "./RichText"
import Image from "next/image"

interface Tab {
    id: number
    label: string
    icon: string
    content: {
      root: {
        type: string;
        children: {
          type: string;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ('ltr' | 'rtl') | null;
        format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    };
}

interface Props {
    tabs: Tab[]
}
const tabs = [
    {
      id: "itinerario",
      label: "Itinerario",
      icon: <MapPin className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Itinerario del Viaje</h3>
          <div className="space-y-3">
            <div className="border-l-2 border-green-500 pl-4">
              <p className="font-medium">Día 1: Llegada</p>
              <p className="text-gray-600">Recepción en el aeropuerto y traslado al hotel.</p>
            </div>
            <div className="border-l-2 border-green-500 pl-4">
              <p className="font-medium">Día 2: City Tour</p>
              <p className="text-gray-600">Visita guiada por los principales puntos turísticos.</p>
            </div>
            <div className="border-l-2 border-green-500 pl-4">
              <p className="font-medium">Día 3: Excursión</p>
              <p className="text-gray-600">Día completo de excursión a sitios naturales.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "incluye",
      label: "Incluye/No Incluye",
      icon: <CheckCircle className="h-5 w-5" />,
      content: (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-green-600">Incluye</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Alojamiento en hotel 4 estrellas</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Desayuno buffet diario</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Traslados aeropuerto-hotel-aeropuerto</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Guía turístico en español</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-red-600">No Incluye</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                <span>Vuelos internacionales</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                <span>Comidas no especificadas</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                <span>Seguro de viaje</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                <span>Propinas y gastos personales</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "precios",
      label: "Precios",
      icon: <Tag className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Precios por Persona</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <p className="text-gray-500">Habitación Individual</p>
              <p className="text-2xl font-bold mt-2">€1,200</p>
              <p className="text-sm text-gray-500">por persona</p>
            </div>
            <div className="border rounded-lg p-4 text-center bg-green-50 border-green-200">
              <p className="text-gray-500">Habitación Doble</p>
              <p className="text-2xl font-bold mt-2 text-green-600">€950</p>
              <p className="text-sm text-gray-500">por persona</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <p className="text-gray-500">Habitación Triple</p>
              <p className="text-2xl font-bold mt-2">€850</p>
              <p className="text-sm text-gray-500">por persona</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">* Precios válidos hasta el 31 de diciembre de 2025</p>
        </div>
      ),
    },
    {
      id: "informacion",
      label: "Información de Viaje",
      icon: <Info className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Información Importante</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium">Documentación</h4>
              <p className="text-gray-600">Pasaporte con validez mínima de 6 meses desde la fecha de regreso.</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium">Clima</h4>
              <p className="text-gray-600">Temperatura media de 25°C durante el día y 15°C por la noche.</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium">Moneda</h4>
              <p className="text-gray-600">Se recomienda llevar euros y cambiar a moneda local en destino.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "opciones",
      label: "Opciones Adicionales",
      icon: <ListTodo className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Servicios Opcionales</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium">Seguro de viaje premium</p>
                <p className="text-sm text-gray-500">Cobertura médica completa y cancelación</p>
              </div>
              <p className="font-medium">€45</p>
            </div>
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium">Excursión adicional</p>
                <p className="text-sm text-gray-500">Día completo con almuerzo incluido</p>
              </div>
              <p className="font-medium">€75</p>
            </div>
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium">Traslado VIP</p>
                <p className="text-sm text-gray-500">Servicio privado con vehículo de lujo</p>
              </div>
              <p className="font-medium">€120</p>
            </div>
          </div>
        </div>
      ),
    },
  ]
export default function TabsViaje({tabs}:Props) {
  const [activeTab, setActiveTab] = useState(0)

  
  return (
    <div className="w-full  mx-auto lg:p-4">
      <div className=" flex  lg:flex-wrap flex-col lg:flex-row justify-between gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center p-4 min-w-[250px] border rounded-md transition-all ${
              activeTab === tab.id ? "border-green-600 bg-white" : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex justify-center mb-2">
              <Image src={tab.icon} alt="" width={30} height={30} className="object-cover"/>
              </div>
            <span className="text-sm font-medium">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-green-600"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      <div className="mt-6 border rounded-lg p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
            <div className="space-y-4">
              <RichText data={tabs.find((tab) => tab.id === activeTab)?.content!}/>
            </div>
        </motion.div>
      </div>
    </div>
  )
}
