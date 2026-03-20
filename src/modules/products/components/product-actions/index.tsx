"use client";

import { addMultipleToCart, addToCart } from "@lib/data/cart";
import { useIntersection } from "@lib/hooks/use-in-view";
import { getMedusaErrorMessage } from "@lib/util/get-medusa-error-message";
import { HttpTypes } from "@medusajs/types";
import { Button, clx, toast } from "@medusajs/ui"; // Asumiendo que tienes clx o usas template strings
import Divider from "@modules/common/components/divider";
import { useParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { convertToLocale } from "@lib/util/money"; // Asegúrate de importar tu utilidad de formato de moneda
import LocalizedClientLink from "@modules/common/components/localized-client-link";

type ProductActionsProps = {
  product: HttpTypes.StoreProduct;
  region: HttpTypes.StoreRegion;
  disabled?: boolean;
};

export default function ProductActions({
  product,
  region, // Necesitamos region para formatear el precio
  disabled,
}: ProductActionsProps) {
  const countryCode = useParams().countryCode as string;
  const [isAdding, setIsAdding] = useState(false);

  // 1. ESTADO: Objeto para manejar cantidades por ID de variante
  // Ejemplo: { "variant_123": 2, "variant_456": 1 }
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const actionsRef = useRef<HTMLDivElement>(null);
  const inView = useIntersection(actionsRef, "0px");

  // Helper para actualizar el estado
  const handleQuantityChange = (variantId: string, change: number) => {
    setQuantities((prev) => {
      const currentQty = prev[variantId] || 0;
      const newQty = Math.max(0, currentQty + change);

      // Opcional: Validar stock aquí si es necesario
      const variant = product.variants?.find((v) => v.id === variantId);
      if (variant?.manage_inventory && !variant.allow_backorder) {
        if (newQty > (variant.inventory_quantity || 0)) {
          return prev; // No incrementar si supera el stock
        }
      }

      return {
        ...prev,
        [variantId]: newQty,
      };
    });
  };

  // Calcular total de items seleccionados para deshabilitar botón si es 0
  const totalItems = useMemo(() => {
    return Object.values(quantities).reduce((acc, curr) => acc + curr, 0);
  }, [quantities]);

  // Calcular precio total estimado (Opcional, para UI)
  const estimatedTotal = useMemo(() => {
    let total = 0;
    product.variants?.forEach((v) => {
      const qty = quantities[v.id] || 0;
      // Nota: Esto asume que calculated_price está disponible en la variante
      // Si usas Medusa V2, asegúrate que el precio esté hidratado correctamente
      const price = v.calculated_price?.calculated_amount || 0;
      total += price * qty;
    });
    return total;
  }, [product.variants, quantities]);

  // 2. LOGICA DE CARRITO: Añadir múltiples variantes
  const handleAddToCart = async () => {
    if (totalItems === 0) return;

    setIsAdding(true);

    // Lógica de fecha que tenías en tu código original
    const hoyMasDosDias = new Date();
    hoyMasDosDias.setDate(hoyMasDosDias.getDate() + 2);

    // Filtramos solo las variantes que tienen cantidad > 0
    const itemsToAdd = Object.entries(quantities).filter(([_, qty]) => qty > 0);

    const itemsToCart = itemsToAdd.map(([variantId, qty]) => {
      return {
        variant_id: variantId,
        quantity: qty,
        countryCode,
        metadata: {
          tour_date: hoyMasDosDias, // Tu lógica de fecha
        },
      };
    });
    try {
      // Ejecutamos todas las promesas de agregar al carrito en paralelo

      await addMultipleToCart(itemsToCart);

      window.dispatchEvent(
        new CustomEvent("cart:item-added", {
          detail: { addedCount: totalItems },
        }),
      );

      // Opcional: Resetear cantidades tras añadir
      // setQuantities({})
    } catch (e) {
      console.error("Error adding to cart", e);
      toast.error(getMedusaErrorMessage(e), {
        position: "top-center",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRouteCart = async () => {
    if (totalItems === 0) return;

    try {
      // Ejecutamos todas las promesas de agregar al carrito en paralelo
      // Opcional: Resetear cantidades tras añadir
      // setQuantities({})
    } catch (e) {
      console.error("Error adding to cart", e);
    } finally {
      setIsAdding(false);
    }
  };
  // Helper simple para mostrar precio
  const getPriceDisplay = (variant: HttpTypes.StoreProductVariant) => {
    if (!variant.calculated_price) return null;
    return convertToLocale({
      amount: variant.calculated_price.calculated_amount!,
      currency_code: region.currency_code,
    });
  };

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div className="flex flex-col gap-y-4">
          {product.variants?.map((variant) => {
            const qty = quantities[variant.id] || 0;
            // Chequeo simple de stock para UI
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
                    {variant.title} {/* Ej: Adult, Child */}
                  </span>
                  <span className="text-small-regular text-ui-fg-subtle">
                    {getPriceDisplay(variant)}
                  </span>
                </div>

                <div className="flex items-center gap-x-3">
                  <button
                    onClick={() => handleQuantityChange(variant.id, -1)}
                    disabled={qty === 0 || isAdding || !!disabled}
                    className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-4 text-center">{qty}</span>
                  <button
                    onClick={() => handleQuantityChange(variant.id, 1)}
                    disabled={outOfStock || isAdding || !!disabled}
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

        {/* Opcional: Mostrar total acumulado visualmente */}
        {totalItems > 0 && (
          <div className="flex justify-between py-2 font-semibold">
            <span>Total Items: {totalItems}</span>
            <span>
              {convertToLocale({
                amount: estimatedTotal,
                currency_code: region.currency_code,
              })}
            </span>
          </div>
        )}

        {
          <Button
            onClick={handleAddToCart}
            disabled={
              !product.variants || !!disabled || isAdding || totalItems === 0
            }
            variant="primary"
            className="w-full h-10"
            isLoading={isAdding}
            data-testid="add-product-button"
          >
            Agregar item al carrito
          </Button>
        }

        {/* MobileActions necesitaría ser refactorizado de forma similar para aceptar quantities en vez de single variant */}
        {/* <MobileActions ... /> */}
      </div>
    </>
  );
}
