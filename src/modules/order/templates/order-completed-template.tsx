import { cookies as nextCookies } from "next/headers";
import NextImage from "next/image";
import { Mail, Phone } from "lucide-react";

import PurchaseTracker from "@/components/analytics/purchase-tracker";
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
  const purchaseItems = (order.items ?? []).map((item) => ({
    itemId: item.variant_id ?? item.id,
    itemName: item.product_title ?? item.title ?? "Reserva",
    itemCategory:
      item.metadata?.is_tour === true
        ? "tour"
        : item.metadata?.is_package === true
          ? "package"
          : "product",
    itemVariant: item.variant?.title ?? undefined,
    quantity: item.quantity ?? 1,
    price:
      typeof item.unit_price === "number"
        ? item.unit_price
        : typeof item.quantity === "number" && item.quantity > 0
          ? (item.total ?? 0) / item.quantity
          : undefined,
  }));

  return (
    <div className="relative overflow-hidden bg-[#f3f3f3]">
      <PurchaseTracker
        eventKey={order.id}
        payload={{
          transactionId: order.id,
          currency: order.currency_code,
          value: payment?.amount ?? order.total,
          contentCategory: "order",
          contentType: "product",
          items: purchaseItems,
        }}
      />
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
        className="pointer-events-none absolute inset-0 z-[1] "
        style={{
          background: "linear-gradient(180deg, #2970B7 0%, #123251 100%)",
          backgroundBlendMode: "multiply",
          opacity: 0.65,
        }}
      />

      <div className="relative z-10 my-5 w-full ">
        {isOnboarding && (
          <div className="">
            <OnboardingCta orderId={order.id} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.15fr_0.85fr] ">
          {/* BLOQUE IZQUIERDO */}
          <section className="flex ">
            <div className="flex justify-center">
              <div className="flex w-full max-w-[860px] justify-center flex-col rounded-r-[86px] rounded-l-none bg-white px-6 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)] sm:px-10 sm:py-10 lg:px-14 lg:py-12 ">
                <div className="flex flex-col gap-8 justify-center items-center">
                  <NextImage
                    src="/pataLogo.png"
                    alt="Pata Rutera"
                    width={208}
                    height={96}
                    className="h-auto w-[150px] sm:w-[180px] lg:w-[208px]"
                    priority
                  />

                  <div className="space-y-4">
                    <h1 className="font-[Inter] text-[24px] font-black leading-[0.95] text-[#2970b7] sm:text-[44px] lg:text-[46px] text-center">
                      ¡GRACIAS, RUTER@!
                    </h1>

                    <p className="max-w-[620px] font-[Inter] text-[18px] leading-[1.45] text-[#6a6a6a] sm:text-[20px] lg:text-[18px]">
                      La operación fue exitosa y estamos listos para llevarte a
                      vivir una gran aventura con
                      <span className="ml-2 font-bold text-[#4f4f4f]">
                        Pata Rutera.
                      </span>
                    </p>
                  </div>

                  <div className="max-w-[680px] space-y-6 pt-2">
                    <div className="flex items-start gap-3">
                      <span className="pt-1 text-[24px] font-bold leading-none text-[#6a6a6a] sm:text-[28px]">
                        ✓
                      </span>
                      <p className="font-[Inter] text-[18px] font-extrabold leading-[1.35] text-[#6a6a6a] sm:text-[15px] lg:text-[20px]">
                        Hemos enviado los detalles de confirmación del pedido a:
                        <span
                          className="ml-2 break-all text-[#efba06]"
                          data-testid="order-email"
                        >
                          {order.email}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="pt-1 text-[24px] font-bold leading-none text-[#6a6a6a] sm:text-[28px]">
                        ✓
                      </span>
                      <div className="space-y-1">
                        <p className="font-[Inter] text-[18px] font-extrabold leading-[1.2] text-[#6a6a6a] sm:text-[15px] lg:text-[20px]">
                          Fecha del pedido:
                        </p>
                        <p
                          className="font-[Inter] text-[18px] leading-[1.35] text-[#6a6a6a] sm:text-[15px] lg:text-[19px]"
                          data-testid="order-date"
                        >
                          {formatDate(orderCreatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" border-t border-[#e8e8e8] pt-6 mt-auto">
                  <p className="mb-4 font-[Inter] text-[22px] font-extrabold leading-none text-[#6a6a6a] sm:text-[26px] lg:text-[20px]">
                    Ponte en contacto con nosotros:
                  </p>

                  <div className="flex flex-col gap-3 font-[Inter] text-[17px] text-[#6a6a6a] sm:text-[18px] lg:text-[15px]">
                    <span className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-[#1d8bc8] lg:h-6 lg:w-6" />
                      +51 930 770 103
                    </span>
                    <span className="flex items-center gap-3 break-all">
                      <Mail className="h-5 w-5 shrink-0 text-[#1d8bc8] lg:h-6 lg:w-6" />
                      ventas@patarutera.pe
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* BLOQUE DERECHO */}
          <aside className="flex">
            <div
              className="flex w-full flex-col justify-center gap-6 xl:max-w-[560px] "
              data-testid="order-complete-container"
            >
              <div className="space-y-3">
                <h2 className="font-[Inter] text-[26px] font-extrabold leading-none text-white sm:text-[30px] lg:text-[32px]">
                  DETALLES DEL SERVICIO
                </h2>

                <div className="overflow-hidden rounded-[24px]  shadow-[0_18px_40px_rgba(0,0,0,0.14)]">
                  <Items order={order} />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="font-[Inter] text-[26px] font-extrabold leading-none text-white sm:text-[30px] lg:text-[32px]">
                  DETALLES DEL PAGO
                </h2>

                <div className="rounded-[24px] bg-white p-5 shadow-[0_18px_40px_rgba(0,0,0,0.14)] sm:p-6">
                  <div className="hidden grid-cols-[2fr_1fr_1fr] gap-4 px-2 pb-3 lg:grid">
                    <span className="pl-2 font-[Poppins] text-[15px] font-semibold text-[#6a6a6a]">
                      Método de pago
                    </span>
                    <span className="font-[Poppins] text-[15px] font-semibold text-[#6a6a6a]">
                      Monto
                    </span>
                    <span className="text-right font-[Poppins] text-[15px] font-semibold text-[#6a6a6a]">
                      Fecha y hora
                    </span>
                  </div>

                  <Divider className="mb-4 !mt-0" />

                  <div className="grid grid-cols-1 gap-5 rounded-[20px] bg-[#f8f8f8] p-4 sm:grid-cols-[auto_1fr] sm:items-center lg:grid-cols-[2fr_1fr_1fr] lg:gap-4 lg:bg-transparent lg:p-0">
                    <div className="flex items-center justify-center sm:justify-start lg:justify-start">
                      <NextImage
                        src="/izipaylogo.png"
                        alt="Izipay"
                        width={208}
                        height={96}
                        className="h-auto w-[140px] sm:w-[160px] lg:w-[180px]"
                        priority
                      />
                    </div>

                    <p
                      className="text-center font-[Poppins] text-[28px] font-bold leading-none text-[#2970b7] sm:text-left lg:text-center lg:text-[32px]"
                      data-testid="payment-amount"
                    >
                      {formattedPaymentAmount}
                    </p>

                    <div className="space-y-1 text-center font-[Inter] text-[14px] leading-[1.2] text-[#6a6a6a] sm:text-right sm:text-[15px] lg:text-right">
                      <p>{formatTime(paymentTimestamp)}</p>
                      <p>{formatShortDate(paymentTimestamp)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
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
