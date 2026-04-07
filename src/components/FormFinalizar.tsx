"use client";

import type { Media } from "@/cms-types";
import { trackInitiateCheckout } from "@lib/analytics";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

import { ReservationCard } from "./ReservationCard";

type BillingFormValues = {
  names: string;
  lastNames: string;
  dni: string;
  city: string;
  phone: string;
  email: string;
  streetAddress: string;
};

interface Props {
  name: string;
  date: string;
  amount: number;
  numberPassengers: number;
  type: string;
  image: Media;
  id: string;
}

const FIGMA_INPUT_CLASSES =
  "h-[53px] rounded-[5px] border-[1.5px] border-[#dddddd] bg-white px-5 text-[15px] font-medium text-[#1f1f1f] placeholder:text-[#9f9f9f] focus-visible:ring-1 focus-visible:ring-[#dddddd] focus-visible:ring-offset-0";

export function BillingForm({
  name,
  date,
  amount,
  numberPassengers,
  type,
  image,
  id,
}: Props) {
  const form = useForm<BillingFormValues>({
    defaultValues: {
      names: "",
      lastNames: "",
      dni: "",
      city: "",
      phone: "",
      email: "",
      streetAddress: "Plaza de Armas de Cusco",
    },
  });

  const onSubmit = async (data: BillingFormValues) => {
    const fullName = `${data.names} ${data.lastNames}`.trim();

    const paymentConf = {
      amount: Math.round(numberPassengers * Number(amount) * 100),
      currency: "PEN",
      customer: {
        reference: fullName,
        email: data.email,
        billingDetails: {
          cellPhoneNumber: `+51 ${data.phone}`,
          identityCode: data.dni,
          state: "Perú",
          district: numberPassengers,
          address: data.city || data.streetAddress,
        },
        shippingDetails: {
          city: data.city || date,
        },
      },
      orderId: `${type}-${id}-${new Date().valueOf()}`,
    };

    const response = await fetch(`/api/createpayment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...paymentConf }),
    });

    if (!response.ok) {
      throw new Error("Error al enviar el formulario");
    }

    trackInitiateCheckout({
      contentName: name,
      contentCategory: type,
      contentType: "product",
      currency: paymentConf.currency,
      value: numberPassengers * Number(amount),
      items: [
        {
          itemId: `${type}-${id}`,
          itemName: name,
          itemCategory: type,
          quantity: numberPassengers,
          price: Number(amount),
        },
      ],
    });

    const result = await response.json();
    const urlPayment = JSON.parse(result.message).answer.paymentURL;
    window.location.href = urlPayment;
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 lg:flex-row lg:items-start">
      <div className="w-full max-w-[760px] px-4 lg:w-2/3">
        <div className="rounded-xl bg-[#f2f2f2] px-4 py-8 sm:px-6 lg:px-10">
          <h2 className="font-[Poppins] text-[24px] font-medium leading-normal text-black">
            2. Información de Pasajero
          </h2>

          <div className="mt-3 h-px w-full bg-[#d9d9d9]" />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-8 space-y-[29px]"
            >
              <div className="grid gap-[18px] sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="names"
                  rules={{ required: "Nombres requeridos" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Nombres</FormLabel>
                      <Input
                        className={FIGMA_INPUT_CLASSES}
                        placeholder="Nombres"
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastNames"
                  rules={{ required: "Apellidos requeridos" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Apellidos</FormLabel>
                      <Input
                        className={FIGMA_INPUT_CLASSES}
                        placeholder="Apellidos"
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="city"
                rules={{ required: "Ciudad requerida" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Ciudad</FormLabel>
                    <Input
                      className={FIGMA_INPUT_CLASSES}
                      placeholder="Ciudad"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dni"
                rules={{ required: "Documento requerido" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Tipo de documento</FormLabel>
                    <Input
                      className={FIGMA_INPUT_CLASSES}
                      placeholder="Tipo de documento"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                rules={{ required: "Teléfono requerido" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">
                      N° de teléfono (Whatsapp)
                    </FormLabel>
                    <Input
                      className={FIGMA_INPUT_CLASSES}
                      placeholder="N° de teléfono (Whatsapp)"
                      type="tel"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "Email requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">
                      Correo electrónico
                    </FormLabel>
                    <Input
                      className={FIGMA_INPUT_CLASSES}
                      placeholder="Correo electrònico"
                      type="email"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  className="h-[51px] w-full rounded-[8px] border border-[#e2e2e2] bg-[#efba06] font-[Poppins] text-[16px] font-bold text-white hover:bg-[#dba900] sm:w-[216px]"
                >
                  Continuar a pagar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <div className="w-full max-w-[380px] px-4 lg:w-1/3">
        <ReservationCard
          name={name}
          amount={Number(amount)}
          numberPassengers={Number(numberPassengers)}
          type={type}
          date={date}
          image={image}
        />
      </div>
    </div>
  );
}
