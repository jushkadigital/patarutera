"use client"

import { Calendar, Users } from "lucide-react"
import { useForm } from "react-hook-form"
import { useState } from "react"
import Image from "next/image"
import { Media } from "@/cms-types"

interface FormData {
  fecha: string
  pasajeros: number
}

interface Props {
    priceTitle: string;
    prevText: string ;
    price: number;
    nextText: string;
    paymentForm?: {
      iconDate?: (number | null) | Media;
      InputPlaceHolderDate?: string | null;
      iconPassengers?: (number | null) | Media;
      InputPlaceHolderPassengers?: string | null;
    };
}

export default function PrecioCardComponent({priceTitle,prevText,price,nextText,paymentForm}:Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      fecha: "",
      pasajeros: 1,
    },
  })

  const onSubmitReserva = async (data: FormData) => {
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Datos de reserva:", {
        ...data,
        precio: 150,
        accion: "reserva",
      })

      setSubmitMessage("¡Reserva iniciada exitosamente!")

      // Aquí podrías redirigir a la página de pago o siguiente paso
      // router.push('/checkout')
    } catch (error) {
      setSubmitMessage("Error al procesar la reserva. Intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmitCarrito = async (data: FormData) => {
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Datos agregados al carrito:", {
        ...data,
        precio: 150,
        accion: "carrito",
      })

      setSubmitMessage("¡Agregado al carrito exitosamente!")
      reset()
    } catch (error) {
      setSubmitMessage("Error al agregar al carrito. Intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto bg-white rounded-3xl shadow-lg overflow-hidden border border-[#eaeaea]">
      {/* Header */}
      <div className="bg-[#2970b7] text-white text-center py-6 rounded-t-3xl">
        <h1 className="text-2xl font-bold tracking-wide">{priceTitle}</h1>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Price Section */}
        <div className="text-center">
          <p className="text-[#2970b7] text-lg mb-2">{prevText}</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-[#2970b7] text-5xl font-bold">S/. {price}</span>
            <span className="text-[#a0a0a0] text-lg">/ {nextText}</span>
          </div>
          <div className="w-full h-1 bg-[#efba06] mt-4 rounded-full"></div>
        </div>

        {/* Form */}
        <form className="space-y-4">
          {/* Date Input */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#6a6a6a] rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <input
                type="date"
                {...register("fecha", {
                  required: "La fecha es requerida",
                  validate: (value) => {
                    const selectedDate = new Date(value)
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    return selectedDate >= today || "La fecha debe ser hoy o posterior"
                  },
                })}
                className={`w-full px-6 py-4 bg-white border-2 rounded-full text-[#6a6a6a] text-lg focus:outline-none transition-colors ${
                  errors.fecha ? "border-red-500 focus:border-red-500" : "border-[#dddddd] focus:border-[#2970b7]"
                }`}
              />
              {errors.fecha && <p className="text-red-500 text-sm mt-1 px-2">{errors.fecha.message}</p>}
            </div>
          </div>

          {/* Passengers Input */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#6a6a6a] rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <select
                {...register("pasajeros", {
                  required: "Selecciona el número de pasajeros",
                  min: { value: 1, message: "Mínimo 1 pasajero" },
                  max: { value: 10, message: "Máximo 10 pasajeros" },
                })}
                className={`w-full px-6 py-4 bg-white border-2 rounded-full text-[#6a6a6a] text-lg focus:outline-none transition-colors ${
                  errors.pasajeros ? "border-red-500 focus:border-red-500" : "border-[#dddddd] focus:border-[#2970b7]"
                }`}
              >
                <option value="">Seleccionar pasajeros</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i + 1 === 1 ? "pasajero" : "pasajeros"}
                  </option>
                ))}
              </select>
              {errors.pasajeros && <p className="text-red-500 text-sm mt-1 px-2">{errors.pasajeros.message}</p>}
            </div>
          </div>
        </form>

        {/* Submit Message */}
        {submitMessage && (
          <div
            className={`text-center p-3 rounded-lg ${
              submitMessage.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {submitMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            type="button"
            onClick={handleSubmit(onSubmitReserva)}
            disabled={isSubmitting}
            className="w-full bg-[#3eae64] text-white text-lg font-bold py-4 rounded-full hover:bg-[#359a57] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "PROCESANDO..." : "CONTINUAR RESERVA"}
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmitCarrito)}
            disabled={isSubmitting}
            className="w-full bg-[#eaeaea] text-[#a0a0a0] text-lg font-medium py-4 rounded-full hover:bg-[#dddddd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Agregando..." : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  )
}
