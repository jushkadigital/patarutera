import type { Destination, Media, Oferta, OfertasBlock as OfertasBlockType, Tour, TourCategory } from '@/cms-types';
import CardTour, { CardTourData } from '@/components/CardTour';
import { Subtitle } from '@/components/Subtitle';
import { BASEURL } from '@/lib/config';
import { cn } from '@/lib/utils';
import GridComponent from "@/components/GridLabelImages";
import { OfertaCardComponent } from '@/components/OfertaCard';

// Añadir 'mode' a las Props
interface Props extends OfertasBlockType {
  context?: {
    nameCollection:string
  }| null
}

export async function OfertasBlock(props: Props) {
  // Usar la prop 'mode', con 'grid' como default
  const {title,typeGrid} = props

  let ofertas:Oferta[] = []
  try {

   const response = await fetch(`${BASEURL}/api/ofertas?limit=100&depth=2&draft=false`)
    if (!response.ok) {
        // Consider logging the response status and text for more detailed error info
        // console.error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data && data.docs) {
      ofertas = data.docs;
    }
  } catch (error) {
    console.error("Error fetching ofertas:", error);
    // Podrías también lanzar el error para que un ErrorBoundary superior lo capture si es necesario
    // throw error;
  }


  return (
    // No hay controles de modo aquí porque es un Server Component
    <div className=" mx-auto py-0 bg bg-white ">
      {/* Contenedor condicional */}
      <Subtitle className="" titleGroup={title}/>
      <div className=" mx-auto">
        <GridComponent items={ofertas.map((ele,idx)=>({
                backgroundImage: (ele.imagen as Media).url! ,
                id: String(ele.id!),
                alt: 'gaa',
                component: <OfertaCardComponent isBigSize={idx==2?true:false}  price={ele.price!} perPerson={ele.persona} type={ele.type} title={ele.title}  background={(ele.imagen as Media).url! } slug={ele.slug!}/>

            }))} layout={typeGrid}/>    
      </div>
    </div>
  );
}

