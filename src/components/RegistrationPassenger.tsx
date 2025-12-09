"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

type FormData = {
  firstNames: string
  lastNames: string
  dni: string
  phone: string
}

interface RegistrationFormProps {
  submitUrl?: string,
  session: any
}

export function RegistrationForm({ submitUrl = "/api/register", session }: RegistrationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setSubmitStatus("idle")

    console.log("REGIS TOKKEN")
    console.log(session.accessToken)
    try {
      const response = await fetch(submitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Error al enviar el formulario")
      }

      const respuesta = await response.text()
      console.log(respuesta)

      setSubmitStatus("success")
      router.refresh()
      reset()
    } catch (error) {
      console.error("Error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Registro</CardTitle>
        <CardDescription>Complete sus datos personales</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombres">Nombres</Label>
            <Input
              id="nombres"
              placeholder="Ingrese sus nombres"
              {...register("firstNames", {
                required: "Los nombres son obligatorios",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
              })}
            />
            {errors.firstNames && <p className="text-sm text-destructive">{errors.firstNames.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellidos">Apellidos</Label>
            <Input
              id="apellidos"
              placeholder="Ingrese sus apellidos"
              {...register("lastNames", {
                required: "Los apellidos son obligatorios",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
              })}
            />
            {errors.lastNames && <p className="text-sm text-destructive">{errors.lastNames.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dni">DNI</Label>
            <Input
              id="dni"
              placeholder="Ingrese su DNI"
              {...register("dni", {
                required: "El DNI es obligatorio",
                pattern: {
                  value: /^[0-9]{8}$/,
                  message: "El DNI debe tener 8 dígitos numéricos",
                },
              })}
            />
            {errors.dni && <p className="text-sm text-destructive">{errors.dni.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="celular">Celular</Label>
            <Input
              id="celular"
              placeholder="Ingrese su celular"
              {...register("phone", {
                required: "El celular es obligatorio",
                pattern: {
                  value: /^[0-9]{9}$/,
                  message: "El celular debe tener 9 dígitos",
                },
              })}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>

          {submitStatus === "success" && (
            <p className="text-sm text-green-600 dark:text-green-400">¡Datos enviados correctamente!</p>
          )}

          {submitStatus === "error" && (
            <p className="text-sm text-destructive">Error al enviar los datos. Intente nuevamente.</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

