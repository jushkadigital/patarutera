import { cookies as nextCookies } from "next/headers";
import NextImage from "next/image";
import { Mail, Phone } from "lucide-react";

import { convertToLocale } from "@lib/util/money";
import Items from "@modules/order/components/items";
import OnboardingCta from "@modules/order/components/onboarding-cta";
import { HttpTypes } from "@medusajs/types";
import { Divider } from "@medusajs/ui";

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder;
};

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies();

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true";
  const orderCreatedAt = new Date(order.created_at);
  const payment = order.payment_collections?.[0]?.payments?.[0];
  const paymentTimestamp = payment?.created_at
    ? new Date(payment.created_at)
    : orderCreatedAt;

  const formatDate = (date: Date) => {
    const parsedDate = Number.isNaN(date.getTime()) ? new Date() : date;
    const value = new Intl.DateTimeFormat("es-PE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(parsedDate);

    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const formatShortDate = (date: Date) => {
    const parsedDate = Number.isNaN(date.getTime()) ? new Date() : date;

    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(parsedDate);
  };

  const formatTime = (date: Date) => {
    const parsedDate = Number.isNaN(date.getTime()) ? new Date() : date;

    return new Intl.DateTimeFormat("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(parsedDate);
  };

  const formattedPaymentAmount = convertToLocale({
    amount: payment?.amount ?? order.total,
    currency_code: order.currency_code,
    locale: "es-PE",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <div className="relative h-full overflow-hidden bg-[#f3f3f3]">
      <NextImage
        src="/gracias.png"
        alt=""
        fill
        className="object-cover object-center"
        aria-hidden="true"
        priority
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(180deg, #2970B7 0%, #123251 100%)",
          backgroundBlendMode: "multiply",
          border: "1px solid #000000",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          opacity: 0.6,
        }}
      />

      <div className="flex flex-row  relative z-10  w-full  ">
        <div className="flex h-full w-1/2 flex-col gap-6 px-2 sm:px-4 lg:px-0">
          {isOnboarding && <OnboardingCta orderId={order.id} />}

          <div className="relative w-full">
            <div className="relative z-10 flex h-full w-full flex-col gap-8 rounded-[100px] justify-center items-center bg-white px-8 py-10 sm:px-10 sm:py-12 lg:px-12">
              <NextImage
                src="/pataLogo.png"
                alt="Pata Rutera"
                width={208}
                height={96}
                className="h-auto w-[160px] sm:w-[208px]"
                priority
              />

              <div className="space-y-5">
                <h1 className="font-[Inter] text-[55px] font-black leading-[0.96] text-[#2970b7]">
                  {"¡GRACIAS, RUTER@!"}
                </h1>

                <p className="max-w-[560px] font-[Inter] text-[clamp(20px,2.1vw,24px)] leading-[1.3] text-[#6a6a6a]">
                  La operacion fue exitosa y estamos listos para llevarte a
                  vivir una gran aventura con
                  <span className="ml-2 font-bold text-[#737373]">
                    Pata Rutera.
                  </span>
                </p>
              </div>

              <div className="space-y-8 pt-2 max-w-[560px]">
                <div className="flex items-start gap-3">
                  <span className="pt-1 font-[Inter] text-[28px] font-bold leading-none text-[#6a6a6a]">
                    ✓
                  </span>
                  <p className="font-[Inter] text-[clamp(21px,2.2vw,24px)] font-extrabold leading-[1.18] text-[#6a6a6a]">
                    Hemos enviado los detalles de confirmacion del pedido a:
                    <span
                      className="ml-2 text-[#efba06]"
                      data-testid="order-email"
                    >
                      {order.email}
                    </span>
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="pt-1 font-[Inter] text-[28px] font-bold leading-none text-[#6a6a6a]">
                    ✓
                  </span>
                  <div>
                    <p className="font-[Inter] text-[clamp(22px,2.3vw,24px)] font-extrabold leading-[1.2] text-[#6a6a6a]">
                      Fecha del pedido:
                    </p>
                    <p
                      className="font-[Inter] text-[clamp(21px,2.2vw,24px)] leading-[1.2] text-[#6a6a6a]"
                      data-testid="order-date"
                    >
                      {formatDate(orderCreatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto space-y-3 pt-10 sm:pt-24 w-[90%]">
                <p className="font-[Inter] text-[clamp(22px,2.2vw,30px)] font-extrabold leading-none text-[#6a6a6a] text-left">
                  Ponte en contacto con Nosotros:
                </p>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 font-[Inter] text-[clamp(18px,1.8vw,20px)] text-[#6a6a6a]">
                  <span className="flex items-center gap-2">
                    <Phone className="h-6 w-6 text-[#1d8bc8]" />
                    +51 930 770 103
                  </span>
                  <span className="flex items-center gap-2">
                    <Mail className="h-6 w-6 text-[#1d8bc8]" />
                    ventas@patarutera.pe
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-1/2 flex-col justify-center items-center">
          <div
            className="flex  flex-col gap-0"
            data-testid="order-complete-container"
          >
            <div className="font-extrabold text-white font-[Inter] text-[32px] leading-none">
              DETALLES DEL SERVICIO
            </div>
            <div className="overflow-hidden rounded-[12px] ">
              <Items order={order} />
            </div>

            <div className="rounded-[16px]   py-5 sm:py-7">
              <div className="font-extrabold text-white font-[Inter] text-[32px] leading-none">
                DETALLES DEL PAGO
              </div>
              <Divider className="!mb-0" />
              <div className="hidden grid-cols-[2.3fr_1fr_0.7fr] px-4 lg:grid">
                <span className="font-[Poppins] text-[15px] font-semibold text-white pl-3">
                  Metodo de Pago
                </span>
                <span className="font-[Poppins] text-[15px] font-semibold text-white">
                  Monto
                </span>
                <span className="font-[Poppins] text-[15px] font-semibold text-white text-center">
                  Fecha y Hora
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-8 bg-white px-4 py-7 rounded-2xl">

                <NextImage
                  src="/izipaylogo.png"
                  alt="Pata Rutera"
                  width={208}
                  height={96}
                  className="h-auto w-[160px] sm:w-[208px]"
                  priority
                />

                <p
                  className="font-[Poppins] text-[clamp(22px,2vw,36px)] font-bold leading-none text-[#2970b7] text-center"
                  data-testid="payment-amount"
                >
                  {formattedPaymentAmount}
                </p>

                <div className="space-y-1 text-left font-[Inter] text-[clamp(7px,1vw,20px)] leading-none text-[#6a6a6a] sm:text-right">
                  <p>{formatTime(paymentTimestamp)}</p>
                  <p>{formatShortDate(paymentTimestamp)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-20 flex h-3 sm:h-4">
        <div className="h-full flex-1 bg-[#2970b7]" />
        <div className="h-full flex-1 bg-[#3eae64]" />
        <div className="h-full flex-1 bg-[#efba06]" />
        <div className="h-full flex-1 bg-[#79368c]" />
      </div>
    </div>
  );
}
