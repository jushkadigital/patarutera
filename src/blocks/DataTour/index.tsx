import { DataTourBlock as DataTourBlockType, Media } from "@/cms-types";
import DataTourBanner from "@/components/DataTourBanner";
import { Subtitle } from "@/components/Subtitle";

interface Props extends DataTourBlockType {
  context?: {
    nameCollection: string
  } | null
}
const trad = {
  easy: 'Facil',
  medium: 'Intermedio',
  hard: 'Dificil'
}
export async function DataTourBlock(props: Props) {
  const { duration, difficulty, groupSize, altitud, idioma } = props
  return (
    <div className="">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 divisor-x-corto ">
        <DataTourBanner
          text={`${duration.valueDia} dia ${duration.valueNoche != 0 ? 'y ' + duration.valueNoche + ' noche' : ''}`}
          title={duration.title}
          imgUrl="duration"
          className="w-44 font-semibold" />
        <DataTourBanner
          text={`${groupSize.value} personas`}
          title={groupSize.title}
          imgUrl="groupSize"
          className="w-44 font-semibold" />
        <DataTourBanner
          text={`${trad[difficulty]}`}
          title={`Dificultad`}
          imgUrl="difficulty"
          className="w-44 font-semibold" />
        <DataTourBanner
          text={`${altitud.value} msnm`}
          title={altitud.title}
          imgUrl="altitud"
          className="w-44 font-semibold" />
        <DataTourBanner
          text={`${idioma.value}`}
          title={idioma.title}
          imgUrl="idioma"
          className="w-44 font-semibold" />



      </div>
    </div>
  )
}
