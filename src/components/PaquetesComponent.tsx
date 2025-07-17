'use client'
import { useSharedState } from "@/hooks/sharedContextDestinos";
import CardPaquete, { CardPaqueteData } from "./cardPaquete"
import { cn } from "@/lib/utils";

interface Props {
    paquetes:CardPaqueteData[]
    mode: boolean
    rangeSlider?:boolean
}
export function PaquetesComponent({paquetes,rangeSlider,mode}:Props){
function isNumberInRange(numberToCheck: number, range: [number, number]): boolean {
  const [minValue, maxValue] = range; // Destructure the array for clarity
  return numberToCheck >= minValue && numberToCheck <= maxValue;
}

  const {priceOne} = useSharedState()
    const containerClasses = cn(
    mode
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
      : 'flex flex-col space-y-4 md:space-y-6 mx-auto w-[90%]'
  );

  console.log(priceOne)
  console.log(rangeSlider)

    return (
        <div className={containerClasses}>
        {paquetes.length > 0 ? (
          rangeSlider ? paquetes.filter(ele=>isNumberInRange(ele.price!,priceOne)).map((tour) => (
            // Pasar la prop 'mode' a CardTour
            // Asegurarse que tour.slug existe y es único. Si no, usar tour.id u otro identificador único.
            <CardPaquete key={tour.id} unitData={tour} mode={mode ? 'grid' : 'list'} />
          )):
          paquetes.map((tour) => (
            // Pasar la prop 'mode' a CardTour
            // Asegurarse que tour.slug existe y es único. Si no, usar tour.id u otro identificador único.
            <CardPaquete key={tour.id} unitData={tour} mode={mode ? 'grid' : 'list'} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No se encontraron tours.</p>
        )}
      </div>
    )
}