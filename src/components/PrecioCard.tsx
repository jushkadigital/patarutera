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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      nombre: "",
      numberPasajeros: 1,
      mensaje: "",
    },
  })

  // 4. ÚNICA FUNCIÓN DE ENVÍO
  // Se reemplazan 'onSubmitReserva' y 'onSubmitCarrito' por una sola función 'onSubmit'.
  const onSubmit = async (data: FormData) => {
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
      const finalMessage = `Hola soy ${data.nombre} estoy interesado en ${origen}:${title} somos ${data.numberPasajeros} pasajeros , mensaje adicional: ${data.mensaje}`
      // En el objeto enviado, incluimos el 'origen' que viene de las props.
      const encodedMessage = encodeURIComponent(finalMessage)
      const waUrl = `https://wa.me/${cleanedNumber}?text=${encodedMessage}`
      window.open(waUrl, '_blank')
      setSubmitMessage("¡Mensaje enviado exitosamente! Gracias por contactarnos.")
      reset() // Limpiamos el formulario después del envío.

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
                <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200">
                  <div className="bg-[#2970b7] text-white text-center py-6 rounded-t-3xl">
                    <h1 className="text-2xl font-bold tracking-wide">{priceTitle}</h1>
                  </div>
                  <div className="text-center">
                    <p className="text-[#2970b7] text-lg mb-2">{prevText}</p>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-[#2970b7] text-3xl font-bold">S/. {price}</span>
                      <span className="text-[#a0a0a0] text-md">/ {nextText}</span>
                    </div>
                    <div className="w-full h-1 bg-[#efba06] mt-4 rounded-full"></div>
                  </div>

                  <div className="p-2 space-y-6">
                    {/* Se utiliza 'handleSubmit' para envolver nuestro 'onSubmit' */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      {/* Campo: Nombre */}
                      <div className="relative">
                        <User className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          placeholder="Nombre completo"
                          {...register("nombre", {
                            required: "El nombre es obligatorio.",
                            minLength: { value: 3, message: "El nombre debe tener al menos 3 caracteres." },
                          })}
                          className={`w-full text-md pl-12 pr-4 py-3 bg-gray-50 border-2 rounded-full text-gray-700 focus:outline-none transition-colors ${errors.nombre ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#2970b7]"
                            }`}
                        />
                        {errors.nombre && <p className="text-red-500 text-xs mt-1 ml-4">{errors.nombre.message}</p>}
                      </div>

                      {/* Campo: Email */}
                      <div className="relative">
                        <Users className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="number"
                          placeholder="Numero de Pasajeros"
                          {...register("numberPasajeros", {
                            required: "Introduzca el número",
                            min: { value: 1, message: "Debe ser al menos 1" },
                          })}
                          className={`w-full text-md pl-12 pr-4 py-3 bg-gray-50 border-2 rounded-full text-gray-700 focus:outline-none transition-colors ${errors.numberPasajeros ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#2970b7]"
                            }`}
                        />
                        {errors.numberPasajeros && <p className="text-red-500 text-xs mt-1 ml-4">{errors.numberPasajeros.message}</p>}
                      </div>

                      {/* Campo: Mensaje */}
                      <div className="relative">
                        <MessageSquare className="absolute top-5 left-4 text-gray-400" size={20} />
                        <textarea
                          placeholder="Escribe tu mensaje aquí..."
                          rows={5}
                          {...register("mensaje", {
                            required: "El mensaje no puede estar vacío.",
                            maxLength: { value: 500, message: "El mensaje no puede superar los 500 caracteres." },
                          })}
                          className={`w-full text-md! pl-12 pr-4 py-3 bg-gray-50 border-2 rounded-2xl text-gray-700 focus:outline-none transition-colors resize-none ${errors.mensaje ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#2970b7]"
                            }`}
                        />
                        {errors.mensaje && <p className="text-red-500 text-xs mt-1 ml-4">{errors.mensaje.message}</p>}
                      </div>

                      {/* Mensaje de Estado (Éxito o Error) */}
                      {submitMessage && (
                        <div
                          className={`text-center p-3 rounded-lg text-sm ${submitMessage.includes("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                            }`}
                        >
                          {submitMessage}
                        </div>
                      )}

                      {/* Botón de Envío */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white text-lg font-bold py-3 rounded-full hover:bg-[#d8a605] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "ENVIANDO..." : "ENVIAR MENSAJE"}
                        {!isSubmitting && <SvgWhatsapp size={20} />}
                      </button>
                    </form>
                  </div>




                </div>

              </DialogContent>
            </Dialog>
          </div>
          :
          <div className="fixed bottom-6 right-6 z-50">

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Link href={'#formPrice'}>
                  <Button
                    size='icon'
                    className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 size-15"
                  >
                    <SvgWhatsapp size={40} className="size-6" />
                    <span className="sr-only">Abrir formulario de contacto</span>
                  </Button>
                </Link>
              </DialogTrigger>
            </Dialog>
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
