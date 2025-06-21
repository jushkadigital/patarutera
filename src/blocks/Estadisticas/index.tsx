import { EstadisticasBlockType } from "@/cms-types";
import RichText from "@/components/RichText";
import { cn } from "@/lib/utils";

interface Props extends EstadisticasBlockType {
context?: {
    nameCollection:string
  }| null
}

export async function EstadisticasBlock(props:Props){
    const {estadisticasText} = props

    const dynamicStyles = {
    "--bg-color": estadisticasText.colorBox?.toLocaleLowerCase() || 'currentColor', // 'currentColor' es un buen fallback
  } as React.CSSProperties;

    const classessBox = cn('text-white','p-1 lg:p-2','rounded-lg','text-center',`bg-[var(--bg-color)]`)
    console.log(estadisticasText.colorBox)

    return (
        <div className="flex flex-col justify-center items-center h-full ">
        <div className="max-w-2xl mx-auto p-6 bg-white">
      {/* Header and Description */}
      <div className="p-6 mb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">{estadisticasText.title}</h1>
        <div className="text-gray-700 text-sm leading-relaxed">
            <RichText data={estadisticasText.description}/>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={dynamicStyles}>
        {
        estadisticasText.estadisticasBox &&  estadisticasText.estadisticasBox.map(ele=>(
        <div key={ele.id} className={classessBox}>
          <div className="text-3xl font-bold mb-2">{ele.numbers}</div>
          <div className="text-sm">{ele.description}</div>
        </div>
            ))
        }
              </div>
    </div>
    </div>
    )
}