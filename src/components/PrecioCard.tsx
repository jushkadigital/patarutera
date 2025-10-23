"use client"

import { Fragment, useState } from "react"
import { usePathname } from 'next/navigation'
import { useForm } from "react-hook-form"
import { User, Mail, MessageSquare, Send, Users } from "lucide-react"
import { Media } from "@/cms-types"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { useMobile } from "@/hooks/useMobile"
import Link from "next/link"
import { SvgWhatsapp } from "./IconsSvg"
import { BookingCard } from "./booking-card"

// 1. INTERFAZ DE DATOS DEL FORMULARIO ACTUALIZADA
// Se cambian los campos 'fecha' y 'pasajeros' por los que necesitas: 'nombre', 'email', 'mensaje'.
interface FormData {
  nombre: string
  numberPasajeros: number
  mensaje: string
}

// 2. PROPS DEL COMPONENTE SIMPLIFICADAS
// Se ajustan las props para que sean más genéricas para un formulario de contacto.
// 'origen' se mantiene para saber de dónde se envía el formulario.
interface Props {
  priceTitle: string;
  prevText: string;
  price: number;
  nextText: string;
  paymentForm?: {
    iconDate?: (number | null) | Media;
    InputPlaceHolderDate?: string | null;
    iconPassengers?: (number | null) | Media;
    InputPlaceHolderPassengers?: string | null;
  };
  origen: string // Por ejemplo: "Página de Contacto", "Tour a Machu Picchu", etc.
  phoneNumber: string
  title: string
}

export default function FormularioContacto({ priceTitle, prevText, price, nextText, origen, phoneNumber, title }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const pathname = usePathname()

  // 3. CONFIGURACIÓN DE REACT-HOOK-FORM ACTUALIZADA
  // Se inicializa el formulario con los nuevos campos y sus valores por defecto.

  // 4. ÚNICA FUNCIÓN DE ENVÍO
  // Se reemplazan 'onSubmitReserva' y 'onSubmitCarrito' por una sola función 'onSubmit'.
  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      // Simulamos una llamada a una API para enviar el correo o guardar en la BD.

      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead');
      }
      if (window.ttq) {
        window.ttq.track('SubmitForm')
      }

      const cleanedNumber = phoneNumber.replace(/[^0-9]/g, '')
      const finalMessage = `Hola deseo informacion sobre ${origen}:${title}  `
      // En el objeto enviado, incluimos el 'origen' que viene de las props.
      const encodedMessage = encodeURIComponent(finalMessage)
      const waUrl = `https://wa.me/${cleanedNumber}?text=${encodedMessage}`
      window.open(waUrl, '_blank')
      setSubmitMessage("¡Mensaje enviado exitosamente! Gracias por contactarnos.")

    } catch (error) {
      console.error("Error al enviar el formulario:", error)
      setSubmitMessage("Error al enviar el mensaje. Por favor, intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const [open, setOpen] = useState(false)

  const isMobile = useMobile()



  function formatMoney(amount: number, currency: string = "PEN", locale: string = "en-US"): string {
    return amount.toLocaleString(locale, {
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  return (
    // 5. ESTRUCTURA Y ESTILOS DEL COMPONENTE ADAPTADOS
    // Se mantiene un diseño limpio y profesional para el formulario.
    <Fragment>
      {
        isMobile ?
          <>
            <div className="fixed bottom-0 right-0 z-80 w-full">

              <Dialog open={open} onOpenChange={setOpen}>
                <div className={`w-full px-10 bg-[#FFF] ${open ? 'hidden' : ''}  border-gray-300 border-t-[0.5px] h-24 flex flex-row justify-center items-center`}>
                  <div className="w-2/3">
                    <div className="text-gray-600"> De: <span className="text-[#25D366] ">S/.{formatMoney(price)} </span></div>
                    <div>{title}</div>

                  </div>
                  <DialogTrigger asChild className="w-1/3">
                    <Button className="bg-[#25D366]  rounded-full text-white xs:py-3! sm:py-7! font-bold text-xs sm:text-lg" onClick={() => setOpen(false)}>
                      RESERVAR
                    </Button>
                  </DialogTrigger>
                </div>

                <DialogContent className="pb-0! px-0! mx-0!">

                  <BookingCard amount={formatMoney(price)} type={origen} slug={pathname} />
                </DialogContent>
              </Dialog>
            </div>
            <div className="fixed bottom-30 right-6 z-50">

              <Button
                size='icon'
                className="bg-[#25D366] rounded-full size-10 cursor-pointer"
                onClick={() => handleSubmit()}
                asChild
              >
                <SvgWhatsapp size={20} className="size-5" />
              </Button>
            </div>
          </>
          :
          <div className="fixed bottom-20 right-20 z-50">

            <Button
              size='icon'
              className="bg-[#25D366] rounded-full size-10 cursor-pointer"
              onClick={() => handleSubmit()}
              asChild
            >
              <SvgWhatsapp size={20} className="size-5" />
            </Button>


          </div>
      }
      {
        isMobile ? " " :
          <div id="formPrice" className=" mx-auto bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200">

            <div className="p-8 space-y-6 relative">
              {/* Campo: Nombre */}
              <BookingCard amount={formatMoney(price)} type={origen} slug={pathname} />

              {/* Botón de Envío */}
            </div>



          </div>

      }
    </Fragment>
  )
}
