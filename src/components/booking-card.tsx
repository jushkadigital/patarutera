"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { CustomCalendar } from "./CustomCalendar";
import { addTourItemsToCart } from "@lib/data/cart";
import { HttpTypes } from "@medusajs/types";
import { convertToLocale } from "@lib/util/money";
import { Divider } from "@medusajs/ui";

interface Props {
  amount: string;
  slug: string;
  type: string;
  medusaId: HttpTypes.StoreProduct;
  tourId?: string;
}

type PassengerType = "ADULT" | "CHILD" | "INFANT";

type SelectedVariant = {
  variant: HttpTypes.StoreProductVariant;
  variantId: string;
  quantity: number;
  unitPrice: number | undefined;
  lineTotal: number | undefined;
  passengerType: PassengerType;
};

const getPassengerType = (variantTitle?: string | null): PassengerType => {
  const normalizedTitle = (variantTitle || "").toLowerCase();

  if (normalizedTitle.includes("infant") || normalizedTitle.includes("bebe")) {
    return "INFANT";
  }

  if (
    normalizedTitle.includes("child") ||
    normalizedTitle.includes("ni") ||
    normalizedTitle.includes("kid")
  ) {
    return "CHILD";
  }

  return "ADULT";
};

const buildPassengersByType = (
  passengerType: PassengerType,
  quantity: number,
): { adults: number; children: number; infants: number } => {
  return {
    adults: passengerType === "ADULT" ? quantity : 0,
    children: passengerType === "CHILD" ? quantity : 0,
    infants: passengerType === "INFANT" ? quantity : 0,
  };
};

export function BookingCard({ amount, slug, type, medusaId, tourId }: Props) {
  const typing = type == "tour" ? 2 : 40;
  const normalizedAmount = amount.replace(/,/g, "").toString();
  const initialDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + typing);
    return d;
  }, [typing]);

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const router = useRouter();
  const product = medusaId;
  const locale = slug.split("/").filter(Boolean)[0] || "pe";

  const [isAdding, setIsAdding] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const productThumbnail = useMemo(() => {
    if (
      typeof product.thumbnail === "string" &&
      product.thumbnail.trim().length > 0
    ) {
      return product.thumbnail;
    }

    const imageUrl = product.images?.find(
      (image) => typeof image?.url === "string" && image.url.trim().length > 0,
    )?.url;

    if (imageUrl) {
      return imageUrl;
    }

    const variantThumbnail = product.variants?.find(
      (variant) =>
        typeof variant.thumbnail === "string" &&
        variant.thumbnail.trim().length > 0,
    )?.thumbnail;

    return variantThumbnail;
  }, [product]);

  const handleQuantityChange = (variantId: string, change: number) => {
    setQuantities((prev) => {
      const currentQty = prev[variantId] || 0;
      const newQty = Math.max(0, currentQty + change);

      const variant = product.variants?.find((v) => v.id === variantId);
      if (variant?.manage_inventory && !variant.allow_backorder) {
        if (newQty > (variant.inventory_quantity || 0)) {
          return prev;
        }
      }

      return {
        ...prev,
        [variantId]: newQty,
      };
    });
  };

  const totalItems = useMemo(() => {
    return Object.values(quantities).reduce((acc, curr) => acc + curr, 0);
  }, [quantities]);

  const estimatedTotal = useMemo(() => {
    let total = 0;
    product.variants?.forEach((v) => {
      const qty = quantities[v.id] || 0;
      const price = v.calculated_price?.calculated_amount || 0;
      total += price * qty;
    });
    return total;
  }, [product.variants, quantities]);

  const handleAddToCart = async () => {
    if (totalItems === 0) {
      return;
    }

    setIsAdding(true);

    try {
      const tourDate = date ? format(date, "yyyy-MM-dd") : undefined;
      if (!tourDate) {
        throw new Error("Missing tour date to add tour items");
      }

      const selectedVariants = Object.entries(quantities)
        .filter(([_, qty]) => qty > 0)
        .map(([variantId, qty]) => {
          const variant = product.variants?.find((v) => v.id === variantId);

          if (!variant) {
            return null;
          }

          const calculatedAmount = variant.calculated_price?.calculated_amount;
          const unitPrice =
            typeof calculatedAmount === "number" &&
            Number.isFinite(calculatedAmount)
              ? calculatedAmount
              : undefined;

          const passengerType = getPassengerType(variant.title);

          return {
            variant,
            variantId,
            quantity: qty,
            unitPrice,
            lineTotal: unitPrice !== undefined ? unitPrice * qty : undefined,
            passengerType,
          };
        })
        .filter((value): value is SelectedVariant => Boolean(value));

      if (!selectedVariants.length) {
        return;
      }

      const groupId =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? `tour_${crypto.randomUUID().replace(/-/g, "")}`
          : `tour_${Date.now()}`;

      const totalPassengers = selectedVariants.reduce(
        (acc, current) => acc + current.quantity,
        0,
      );

      const variantBreakdown = selectedVariants.map((entry) => ({
        type: entry.passengerType,
        quantity: entry.quantity,
        variant_id: entry.variantId,
        ...(entry.lineTotal !== undefined
          ? { line_total: entry.lineTotal }
          : {}),
        ...(entry.unitPrice !== undefined
          ? { unit_price: entry.unitPrice }
          : {}),
      }));

      const pricingSummary = selectedVariants.reduce(
        (acc, entry) => {
          const existing = acc[entry.passengerType];

          if (existing) {
            existing.quantity += entry.quantity;
            if (
              existing.unit_price === undefined &&
              entry.unitPrice !== undefined
            ) {
              existing.unit_price = entry.unitPrice;
            }
          } else {
            acc[entry.passengerType] = {
              type: entry.passengerType,
              quantity: entry.quantity,
              unit_price: entry.unitPrice,
            };
          }

          return acc;
        },
        {} as Record<
          PassengerType,
          { type: PassengerType; quantity: number; unit_price?: number }
        >,
      );

      const pricingBreakdown = Object.values(pricingSummary);

      const items = selectedVariants.map((entry) => ({
        variant_id: entry.variantId,
        quantity: entry.quantity,
        ...(entry.unitPrice !== undefined
          ? { unit_price: entry.unitPrice }
          : {}),
        metadata: {
          is_tour: true,
          tour_id: tourId,
          group_id: groupId,
          tour_date: tourDate,
          thumbnail: productThumbnail,
          passengers: buildPassengersByType(
            entry.passengerType,
            entry.quantity,
          ),
          passenger_type: entry.passengerType,
          line_passengers: entry.quantity,
          total_passengers: totalPassengers,
          tour_destination: product.title,
          pricing_breakdown: pricingBreakdown,
          variant_breakdown: variantBreakdown,
          ...(entry.lineTotal !== undefined
            ? { line_total: entry.lineTotal }
            : {}),
          ...(entry.unitPrice !== undefined
            ? { unit_price: entry.unitPrice }
            : {}),
          tour_duration_days: 1,
        },
      }));

      await addTourItemsToCart({
        countryCode: locale,
        tourDate,
        items,
      });

      window.dispatchEvent(
        new CustomEvent("cart:item-added", {
          detail: { addedCount: totalItems },
        }),
      );

      router.refresh();
      setIsAddedToCart(true);
    } catch (e) {
      console.error("Error adding to cart", e);
    } finally {
      setIsAdding(false);
    }
  };

  const handleGoToCart = () => {
    router.push(`/${locale}/cart`);
  };

  const getPriceDisplay = (variant: HttpTypes.StoreProductVariant) => {
    if (!variant.calculated_price) {
      return null;
    }

    return convertToLocale({
      amount: variant.calculated_price.calculated_amount!,
      currency_code: variant.calculated_price.currency_code || "pen",
    });
  };

  return (
    <Card className="w-full mx-auto p-6 shadow-lg h-[80vh] md:h-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-muted-foreground text-sm">De:</span>
          <span className="text-3xl font-bold text-[#2970b7]">
            S/.{normalizedAmount}
          </span>
        </div>
      </div>

      <div className="space-y-4 w-full">
        <div className="flex flex-col gap-y-4">
          {product.variants?.map((variant) => {
            const qty = quantities[variant.id] || 0;
            const outOfStock =
              variant.manage_inventory &&
              !variant.allow_backorder &&
              (variant.inventory_quantity || 0) <= 0;

            return (
              <div
                key={variant.id}
                className="flex items-center justify-between border p-3 rounded-md"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-ui-fg-base">
                    {variant.title}
                  </span>
                  <span className="text-small-regular text-ui-fg-subtle">
                    {getPriceDisplay(variant)}
                  </span>
                </div>

                <div className="flex items-center gap-x-3">
                  <button
                    onClick={() => handleQuantityChange(variant.id, -1)}
                    disabled={qty === 0 || isAdding}
                    className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-4 text-center">{qty}</span>
                  <button
                    onClick={() => handleQuantityChange(variant.id, 1)}
                    disabled={outOfStock || isAdding}
                    className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <Divider />

        <Popover open={isDateOpen} modal>
          <PopoverTrigger asChild onClick={() => setIsDateOpen(!isDateOpen)}>
            <button className="w-full text-left p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#2970b7] font-semibold mb-1">Fecha</div>
                </div>
                <div className="text-gray-700">
                  {date?.toLocaleDateString("es-PE")}
                </div>
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 h-100">
            <CustomCalendar
              date={date}
              setDate={setDate}
              initialDate={initialDate}
              setIsDateOpen={setIsDateOpen}
            />
          </PopoverContent>
        </Popover>

        <div className="text-[11px] text-center">
          Paquetes son reservados 40 dias antes
        </div>

        {totalItems > 0 && (
          <div className="flex justify-between py-2 font-semibold">
            <span>Total Items: {totalItems}</span>
            <span>
              {convertToLocale({
                amount: estimatedTotal,
                currency_code:
                  product.variants?.[0]?.calculated_price?.currency_code ||
                  "pen",
              })}
            </span>
          </div>
        )}
      </div>

      <Button
        className="w-full mt-6 h-14 text-lg font-semibold bg-[#2970b7] hover:bg-[black] text-white rounded-full shadow-md cursor-pointer"
        size="lg"
        onClick={isAddedToCart ? handleGoToCart : handleAddToCart}
        disabled={
          isAddedToCart
            ? isAdding
            : !product.variants || isAdding || totalItems === 0
        }
        data-testid="add-product-button"
      >
        {isAddedToCart ? "Ir al carrito" : "Agregar al carrito"}
      </Button>
    </Card>
  );
}
