"use client"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReservationCard } from "./ReservationCard"
import { v4 as uuidv4 } from 'uuid'
import { url } from "inspector"
import { Media } from "@/cms-types"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
type BillingFormValues = {
  names: string
  country: string
  dni: string
  streetAddress: string
  city: string
  state: string
  postcode: string
  phone: string
  email: string
  hotel: string
}
interface Props {
  name: string
  date: string
  amount: number
  numberPassengers: number
  type: string
  image: Media
  id: string
}



export function BillingForm({ name, date, amount, numberPassengers, type, image, id }: Props) {
  const form = useForm<BillingFormValues>({
    defaultValues: {
      names: "",
      country: "",
      streetAddress: "",
      city: "",
      phone: "",
      email: "",
      hotel: "Plaza de Armas de Cusco",
    },
  })



  const passengerName = form.watch("names")
  const countryCodeValue = form.watch("country");
  const hotelStatus = form.watch("hotel");

  const onSubmit = async (data: BillingFormValues) => {
    const paymentConf = {
      amount: Math.round(numberPassengers * Number(amount) * 100),
      currency: "PEN",
      customer: {
        reference: data.names,
        email: (data.email),
        billingDetails: {
          cellPhoneNumber: countryCodeValue + ' ' + data.phone,
          identityCode: data.dni,
          state: phoneCountryOptions.find(ele => ele.value == data.country)!.label,
          district: numberPassengers,
          address: data.streetAddress
        },
        shippingDetails: {
          city: date,
        }
      },
      orderId: `${type}-${id}-${new Date().valueOf()}`
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

    if (typeof window.fbq === 'function') {
      window.fbq('track', 'InitiateCheckout');
      window.fbq('track', 'AddPaymentInfo');
    }
    if (window.ttq) {
      window.ttq.track('AddPaymentInfo')
      window.ttq.track('InitiateCheckout')
    }
    const result = await response.json();
    console.log((result))
    const urlPayment = JSON.parse(result.message).answer.paymentURL
    console.log((urlPayment))
    window.location.href = urlPayment
  }

  const phoneCountryOptions = [
    // EUROPA (España)
    { value: '+34', label: 'España' },

    // AMÉRICA DEL NORTE
    { value: '+1', label: 'Estados Unidos y Canadá (+1)' }, // Código unificado +1
    { value: '+52', label: 'México' },
    // Códigos de área del Caribe y otros territorios +1
    { value: '+1-242', label: 'Bahamas' },
    { value: '+1-767', label: 'Dominica' },
    { value: '+1-809', label: 'República Dominicana (+1-809, +1-829, +1-849)' },
    { value: '+1-876', label: 'Jamaica' },
    { value: '+1-787', label: 'Puerto Rico (+1-787, +1-939)' },
    { value: '+1-868', label: 'Trinidad y Tobago' },
    { value: '+1-340', label: 'Islas Vírgenes de EE. UU.' },

    // AMÉRICA CENTRAL
    { value: '+501', label: 'Belice' },
    { value: '+502', label: 'Guatemala' },
    { value: '+503', label: 'El Salvador' },
    { value: '+504', label: 'Honduras' },
    { value: '+505', label: 'Nicaragua' },
    { value: '+506', label: 'Costa Rica' },
    { value: '+507', label: 'Panamá' },

    // AMÉRICA DEL SUR
    { value: '+54', label: 'Argentina' },
    { value: '+55', label: 'Brasil' },
    { value: '+56', label: 'Chile' },
    { value: '+57', label: 'Colombia' },
    { value: '+51', label: 'Perú' },
    { value: '+591', label: 'Bolivia' },
    { value: '+593', label: 'Ecuador' },
    { value: '+595', label: 'Paraguay' },
    { value: '+598', label: 'Uruguay' },
    { value: '+58', label: 'Venezuela' },

  ];


  return (
    <div className="w-full flex flex-col md:flex-row justify-center items-center lg:items-start">
      <div className="mx-auto  p-6 w-[80%] lg:w-2/3">
        <h1 className="mb-8 text-2xl font-semibold">Datos del Pasajero</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* First name and Last name */}
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="names"
                rules={{ required: "Nombres requeridos" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nombres<span className="text-destructive">*</span>
                    </FormLabel>
                    <Input placeholder="Nombres y Apellidos" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dni"
                rules={{ required: "DNI o Pasaporte requerido" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      DNI o Pasaporte<span className="text-destructive">*</span>
                    </FormLabel>
                    <Input type="text" placeholder=".." {...field} />
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
                rules={{ required: "Pais es requerido" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Country / Pais <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un Pais" />
                      </SelectTrigger>
                      <SelectContent>
                        {phoneCountryOptions.map((ele) => (
                          <SelectItem value={ele.value}>{ele.label}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hotel"
                rules={{
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Recojo
                    </FormLabel>
                    <RadioGroup onValueChange={(e) => {
                      field.onChange(e)
                      if (e !== "otro") {
                        form.setValue("streetAddress", e)
                      } else {
                        form.setValue("streetAddress", "")
                      }
                    }} value={field.value}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="Plaza de Armas de Cusco" id="r1" />
                        <Label htmlFor="r1">Plaza de Armas de Cusco</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="Plaza Regocijos" id="r2" />
                        <Label htmlFor="r2">Plaza Regocijos</Label>
                      </div>
                      <div className="flex flex-col  gap-3">
                        <div className="flex items-center gap-3">

                          <RadioGroupItem value="otro" id="r3" />
                          <Label htmlFor="r3">Otra Ubicacion</Label>
                        </div>
                        {field.value == 'otro' &&
                          <FormField
                            control={form.control}
                            name="streetAddress"
                            rules={{ required: "Direccion de domicilio requirido" }}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Direccion <span className="text-destructive">*</span>
                                </FormLabel>
                                <Input placeholder="Av o Calle" {...field} />
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                        }
                      </div>
                    </RadioGroup>
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
                render={({ field }) => {
                  const prefix = countryCodeValue + " " || '';

                  // 2. Combina el valor que se debe mostrar en el Input: [prefijo + valor actual del campo]
                  const displayValue = prefix + (field.value || '');

                  // 3. Define la función onChange para asegurar que solo se guarde el número
                  const handlePhoneChange = (e) => {
                    let newValue = e.target.value;

                    // Intenta eliminar el prefijo del código de país para obtener solo el número.
                    // Esto evita que el prefijo sea guardado si ya está en la entrada.
                    if (prefix && newValue.startsWith(prefix)) {
                      newValue = newValue.substring(prefix.length);
                    }
                    // Llama a la función onChange de React Hook Form con solo el número.
                    field.onChange(newValue);
                  }
                  return (
                    <FormItem>
                      <FormLabel>
                        Telefono <span className="text-destructive">*</span>
                      </FormLabel>
                      <Input
                        placeholder="Numero de Telefono"
                        type="tel"
                        // Usa el valor combinado para mostrar el prefijo
                        value={displayValue}
                        // Usa la función personalizada para limpiar el prefijo antes de guardar
                        onChange={handlePhoneChange}
                        onBlur={field.onBlur} // Importante mantener el onBlur
                        name={field.name}     // Importante mantener el name
                      />
                      <FormMessage />
                    </FormItem>
                  )
                }}
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
                    <Input placeholder="Email" type="email" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-6 md:grid-cols-2">

            </div>

            {/* Booking Button */}
            <div className="pt-4">
              <Button type="submit" size="lg" className="w-full md:w-auto bg-[#2970b7] hover:bg-[black] cursor-pointer">
                Reservar
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="w-[80%] md:w-1/3">
        <ReservationCard name={name} amount={Number(amount)} numberPassengers={Number(numberPassengers)} type={type} date={date} image={image} />
      </div>
    </div>
  )
}
