'use client'
import { useSharedState } from "@/hooks/sharedContextDestinos";
import CardTour, { CardTourData } from "./CardTour"
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/useMobile";

interface Props {
  tours: CardTourData[]
  mode: boolean
  rangeSlider?: boolean
}
export function ToursComponent({ tours, rangeSlider, mode }: Props) {
  function isNumberInRange(numberToCheck: number, range: [number, number]): boolean {
    const [minValue, maxValue] = range; // Destructure the array for clarity
    return numberToCheck >= minValue && numberToCheck <= maxValue;
  }

  const { priceOne } = useSharedState()
  const containerClasses = cn(
    mode
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 space-y-10 md:gap-6'
      : 'flex flex-col space-y-4 md:space-y-6 mx-auto w-[90%]'
  );

  console.log(priceOne)
  console.log(rangeSlider)


  const responsive = useMobile({ breakpoint: 480 })

  return (
    <div className={containerClasses}>
      {tours.length > 0 ? (
        rangeSlider ? tours.filter(ele => isNumberInRange(ele.price!, priceOne)).map((tour) => (
          // Pasar la prop 'mode' a CardTour
          // Asegurarse que tour.slug existe y es único. Si no, usar tour.id u otro identificador único.
          <CardTour key={tour.id} unitData={tour} mode={mode ? 'grid' : responsive ? 'grid' : 'list'} />
        )) :
          tours.map((tour) => (
            // Pasar la prop 'mode' a CardTour
            // Asegurarse que tour.slug existe y es único. Si no, usar tour.id u otro identificador único.
            <CardTour key={tour.id} unitData={tour} mode={mode ? 'grid' : 'list'} />
          ))
      ) : (
        <p className="col-span-full text-center text-gray-500">Proximamente vendran nuevos Tours</p>
      )}
    </div>
  )
}
