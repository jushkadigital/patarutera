"use client";

import { trackContact } from "@/lib/analytics";
import { Fragment, useState } from "react";
import { usePathname } from "next/navigation";
import { Media } from "@/cms-types";
import { Button } from "./ui/button";
import { useMobile } from "@/hooks/useMobile";
import { SvgWhatsapp } from "./IconsSvg";
import { BookingCard } from "./booking-card";
import { HttpTypes } from "@medusajs/types";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface Props {
  paymentForm?: {
    iconDate?: (number | null) | Media;
    InputPlaceHolderDate?: string | null;
    iconPassengers?: (number | null) | Media;
    InputPlaceHolderPassengers?: string | null;
  };
  origen: string; // Por ejemplo: "Página de Contacto", "Tour a Machu Picchu", etc.
  phoneNumber: string;
  title: string;
  medusaId: HttpTypes.StoreProduct;
  formId?: number;
}

export default function FormularioContacto({
  origen,
  phoneNumber,
  title,
  medusaId,
  formId,
}: Props) {
  const pathname = usePathname();

  const handleSubmit = async () => {
    try {
      const cleanedNumber = phoneNumber.replace(/[^0-9]/g, "");
      const finalMessage = `Hola deseo informacion sobre ${origen}:${title}  `;
      const encodedMessage = encodeURIComponent(finalMessage);
      const waUrl = `https://wa.me/${cleanedNumber}?text=${encodedMessage}`;

      trackContact({
        contentName: title,
        contentCategory: origen,
        contentType: "contact",
        description: `WhatsApp contact from ${origen}`,
        pageLocation: window.location.href,
        items: [
          {
            itemId: medusaId.id,
            itemName: title,
            itemCategory: origen,
          },
        ],
      });

      window.open(waUrl, "_blank");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  const [open, setOpen] = useState(false);

  const isMobile = useMobile();

  return (
    <Fragment>
      {isMobile ? (
        <>
          <div className="fixed bottom-0 right-0 z-80 w-full">
            <Sheet open={open} onOpenChange={setOpen}>
              <div
                className={`w-full px-10 bg-[#FFF] ${open ? "hidden" : ""}  border-gray-300 border-t-[0.5px] h-24 flex flex-row justify-center items-center`}
              >
                <div className="w-2/3">
                  <div className="text-gray-600">
                    {" "}
                    De: <span className="text-[#25D366] "></span>
                  </div>
                  <div>{title}</div>
                </div>
                <SheetTrigger asChild className="w-1/3">
                  <Button className="bg-[#25D366]  rounded-full text-white xs:py-3! sm:py-7! font-bold text-xs sm:text-lg">
                    RESERVAR
                  </Button>
                </SheetTrigger>
              </div>

              <SheetContent
                side="bottom"
                className="max-h-[92dvh] gap-0 overflow-hidden rounded-t-3xl border-0 p-0 [&>button]:top-5 [&>button]:right-5"
              >
                <BookingCard
                  type={origen}
                  slug={pathname}
                  medusaId={medusaId}
                />
              </SheetContent>
            </Sheet>
          </div>
          <div className="fixed bottom-30 right-6 z-50">
            <Button
              size="icon"
              className="bg-[#25D366] rounded-full size-10 cursor-pointer"
              onClick={() => void handleSubmit()}
            >
              <SvgWhatsapp size={20} className="size-5" />
            </Button>
          </div>
        </>
      ) : (
        <div className="fixed bottom-20 right-20 z-50">
          <Button
            size="icon"
            className="bg-[#25D366] rounded-full size-10 cursor-pointer"
            onClick={() => void handleSubmit()}
          >
            <SvgWhatsapp size={20} className="size-5" />
          </Button>
        </div>
      )}
      {isMobile ? (
        " "
      ) : (
        <div
          id="formPrice"
          className=" mx-auto bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200"
        >
          <div className="p-8 space-y-6 relative">
            {/* Campo: Nombre */}
            <BookingCard
              type={origen}
              slug={pathname}
              medusaId={medusaId}
              formId={formId}
            />

            {/* Botón de Envío */}
          </div>
        </div>
      )}
    </Fragment>
  );
}
