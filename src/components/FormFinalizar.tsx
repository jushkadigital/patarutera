"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReservationCard } from "./ReservationCard"
import { v4 as uuidv4 } from 'uuid'
import { url } from "inspector"
import { Media } from "@/cms-types"

type BillingFormValues = {
  firstName: string
  lastName: string
  country: string
  streetAddress: string
  city: string
  state: string
  postcode: string
  phone: string
  email: string
}
interface Props {
  name: string
  date: string
  amount: number
  numberPassengers: number
  type: string
  image: Media
}

export function BillingForm({ name, date, amount, numberPassengers, type, image }: Props) {
  const form = useForm<BillingFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      country: "",
      streetAddress: "",
      city: "",
      state: "",
      postcode: "",
      phone: "",
      email: "",
    },
  })

  const id = uuidv4()
  const onSubmit = async (data: BillingFormValues) => {
    const referiCode = 'PATA'
    const paymentConf = {
      amount: Math.round(Number(amount) * 100),
      currency: "PEN",
      customer: {
        reference: referiCode,
        email: (data.email),
      },
      orderId: `order-${id}`
    }
    console.log(paymentConf)
    const response = await fetch(`/api/createpayment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...paymentConf }),
    });
    if (!response.ok) {
      throw new Error('Error al enviar el formulario');
    }
    const result = await response.json();
    console.log((result))
    const urlPayment = JSON.parse(result.message).answer.paymentURL
    console.log((urlPayment))
    window.location.href = urlPayment
  }


  return (
    <div className="w-full flex flex-row">
      <div className="mx-auto max-w-4xl p-6 w-2/3">
        <h1 className="mb-8 text-2xl font-semibold">Billing details</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* First name and Last name */}
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                rules={{ required: "First name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nombres<span className="text-destructive">*</span>
                    </FormLabel>
                    <Input placeholder="Josue" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                rules={{ required: "Last name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Apellidos <span className="text-destructive">*</span>
                    </FormLabel>
                    <Input placeholder="Cornejo" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Country / Region */}


            {/* Street address and Town / City */}
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="country"
                rules={{ required: "Country is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Country / Pais <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="peru">Peru</SelectItem>
                        <SelectItem value="argentina">Argentina</SelectItem>
                        <SelectItem value="chile">Chile</SelectItem>
                        <SelectItem value="colombia">Colombia</SelectItem>
                        <SelectItem value="mexico">Mexico</SelectItem>
                        <SelectItem value="spain">Spain</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="streetAddress"
                rules={{ required: "Street address is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Direccion <span className="text-destructive">*</span>
                    </FormLabel>
                    <Input placeholder="Cipreces Versalles" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* State / County and Postcode / ZIP */}
            <div className="grid gap-6 md:grid-cols-2">


            </div>

            {/* Phone and Email */}
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                rules={{ required: "Phone is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Telefono <span className="text-destructive">*</span>
                    </FormLabel>
                    <Input placeholder="935207981" type="tel" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-destructive">*</span>
                    </FormLabel>
                    <Input placeholder="urgosxd@gmail.com" type="email" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Booking Button */}
            <div className="pt-4">
              <Button type="submit" size="lg" className="w-full md:w-auto">
                Reservar
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="w-1/3">
        <ReservationCard name={name} amount={Number(amount)} numberPassengers={Number(numberPassengers)} type={type} date={date} image={image} />
      </div>
    </div>
  )
}
