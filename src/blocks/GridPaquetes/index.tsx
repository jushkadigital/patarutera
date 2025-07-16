import type { Destination, GridPaquetesBlock as GridPaqueteBlockType, Paquete } from '@/cms-types';
import { CardPaqueteData } from '@/components/cardPaquete';
import CardTour, { CardTourData } from '@/components/CardTour';
import { Pagination } from '@/components/Pagination';
import { PaquetesComponent } from '@/components/PaquetesComponent';
import { Subtitle } from '@/components/Subtitle';
import { ToursComponent } from '@/components/ToursComponent';
import { useSharedState } from '@/hooks/sharedContextDestinos';
import { BASEURL } from '@/lib/config';
import { cn } from '@/lib/utils';

// Añadir 'mode' a las Props
interface Props extends GridPaqueteBlockType {
  rangeSlider?: boolean
  searchParams?: string
  page?: number
}

export async function GridPaquetes(props: Props) {
  // Usar la prop 'mode', con 'grid' como default
  const { id, gridColumns, gridStyle:mode  ,destination,blockTitle,searchParams,page,overrideDefaults} = props;



  console.log(destination)
  let data
  let paquetes: CardPaqueteData[] = [];
  let fetchError = null;
const params = new URLSearchParams()


    if((destination as Destination[])){
        params.append('where[destinos.name][in]', (destination as Destination[]).map(c => c.name).join(','))
    }

  try {
    const queryString = params.toString();    
    // console.log('grid tours HERE') 
  const pageNumber = page ? `&page=${page}` : ''
   const response = await fetch(`${BASEURL}/api/paquetes?limit=${gridColumns}${pageNumber}&depth=2&draft=false&select[featuredImage]=true&select[slug]=true&select[title]=true&select[price]=true&select[Desde]=true&select[difficulty]=true&select[iconDifficulty]=true&select[maxPassengers]=true&select[iconMaxPassengers]=true&select[Person desc]=true&select[miniDescription]=true&select[destinos]=true&${queryString}`);
    if (!response.ok) {
        // Consider logging the response status and text for more detailed error info
        // console.error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
    }
     data = await response.json();
    if (data && data.docs) {
      paquetes = data.docs;
    }
  } catch (error) {
    console.error("Error fetching paquetes:", error);
    // Podrías también lanzar el error para que un ErrorBoundary superior lo capture si es necesario
    // throw error;
  }

  const mode2= false
  // Clases condicionales basadas en la prop 'mode'
  const containerClasses = cn(
    mode
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
      : 'flex flex-col space-y-4 md:space-y-6 mx-auto w-[90%]'
  );

  if (fetchError) {
    return <div className="container mx-auto py-8 text-center text-red-500">{fetchError}</div>;
  }
  

  console.log('render.BlockTour')
  return (
    // No hay controles de modo aquí porque es un Server Component
    <div className=" mx-auto py-4 bg bg-white w-[90%]">
      {/* Contenedor condicional */}
      <Subtitle className="" titleGroup={blockTitle}/>
      <PaquetesComponent mode={mode!} paquetes={paquetes} rangeSlider={props.rangeSlider}/>
      
      {overrideDefaults && data.totalPages &&( <Pagination page={data.page}  totalPages={data.totalPages} searchParams={searchParams!}/>)}
    </div>
  );
}