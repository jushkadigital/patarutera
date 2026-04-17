"use client";
import { useSharedState } from "@/hooks/sharedContextDestinos";
import CardPaquete, { CardPaqueteData } from "./cardPaquete";
import { cn } from "@/lib2/utils";
import { useMobile } from "@/hooks/useMobile";

interface Props {
  paquetes: CardPaqueteData[];
  mode: boolean;
  rangeSlider?: boolean;
}
export function PaquetesComponent({ paquetes, rangeSlider, mode }: Props) {
  function isNumberInRange(
    numberToCheck: number,
    range: [number, number],
  ): boolean {
    const [minValue, maxValue] = range; // Destructure the array for clarity
    return numberToCheck >= minValue && numberToCheck <= maxValue;
  }

  function getComparablePrice(tour: CardPaqueteData): number | null {
    const medusaPrice = tour.priceMedusa?.amount;
    if (typeof medusaPrice === "number") {
      return medusaPrice;
    }

    if (typeof tour.price === "number") {
      return tour.price;
    }

    return null;
  }

  const { priceOne } = useSharedState();
  const isMobile = useMobile({ breakpoint: 1024 });
  const shouldUseGridMode = mode || isMobile;
  const containerClasses = cn(
    shouldUseGridMode
      ? "grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6"
      : "mx-auto flex w-[90%] flex-col space-y-4 md:space-y-6",
  );

  return (
    <div className={containerClasses}>
      {paquetes.length > 0 ? (
        rangeSlider ? (
          paquetes
            .filter((tour) => {
              const comparablePrice = getComparablePrice(tour);
              if (comparablePrice === null) {
                return true;
              }

              return isNumberInRange(comparablePrice, priceOne);
            })
            .map((tour) => (
              // Pasar la prop 'mode' a CardTour
              // Asegurarse que tour.slug existe y es único. Si no, usar tour.id u otro identificador único.
              <CardPaquete
                key={tour.id}
                unitData={tour}
                mode={shouldUseGridMode ? "grid" : "list"}
              />
            ))
        ) : (
          paquetes.map((tour) => (
            // Pasar la prop 'mode' a CardTour
            // Asegurarse que tour.slug existe y es único. Si no, usar tour.id u otro identificador único.
            <CardPaquete
              key={tour.id}
              unitData={tour}
              mode={shouldUseGridMode ? "grid" : "list"}
            />
          ))
        )
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No se encontraron Paquetes
        </p>
      )}
    </div>
  );
}
