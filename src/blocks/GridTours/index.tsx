import type { Destination, GridToursBlock as GridToursBlockType, Tour, TourCategory } from '@/cms-types';
import CardTour, { CardTourData } from '@/components/CardTour';
import { Pagination } from '@/components/Pagination';
import { Subtitle } from '@/components/Subtitle';
import { ToursComponent } from '@/components/ToursComponent';
import { useSharedState } from '@/hooks/sharedContextDestinos';
import { BASEURL } from '@/lib/config';
import { cn } from '@/lib/utils';

// Añadir 'mode' a las Props
interface Props extends GridToursBlockType {
  rangeSlider?: boolean
  searchParams?: string
  page?: number
  context?: {
    nameCollection:string
  }| null
}

export async function GridTours(props: Props) {
  // Usar la prop 'mode', con 'grid' como default
  const { id, gridColumns, gridStyle:mode  ,destination,category,blockTitle, page, overrideDefaults,searchParams} = props;



  console.log(mode)
  let tours: CardTourData[] = [];
  let data
  let fetchError = null;
const params = new URLSearchParams()

const paramsCat = new URLSearchParams()

    if((destination as Destination)){
        params.append('where[destinos.name][equals]', (destination as Destination).name)
    }

    if((category as TourCategory[]).length > 0){
        paramsCat.append('where[categorias.name][in]', (category as TourCategory[]).map(c => c.name).join(','))
    }
  try {
    const queryString = params.toString();    
    const queryStringCat = paramsCat.toString()
    // console.log('grid tours HERE') 
    const pageNumber = page ? `&page=${page}` : ''
    const response = await fetch(`${BASEURL}/api/tours?limit=${gridColumns }${pageNumber}&depth=2&draft=false&select[featuredImage]=true&select[slug]=true&select[title]=true&select[price]=true&select[Desde]=true&select[difficulty]=true&select[iconDifficulty]=true&select[maxPassengers]=true&select[iconMaxPassengers]=true&select[Person desc]=true&select[miniDescription]=true&select[destinos]=true&${queryString}&${queryStringCat}`,{
    next: { tags: ['tours'] },
    });
    if (!response.ok) {
        // Consider logging the response status and text for more detailed error info
        // console.error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    data = await response.json();
    if (data && data.docs) {
      tours = data.docs;
    }
  } catch (error) {
    console.error("Error fetching tours:", error);
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
    <div className=" mx-auto  bg bg-white w-full">
      {/* Contenedor condicional */}
      <Subtitle className="" titleGroup={blockTitle}/>
      <ToursComponent mode={mode!} tours={tours} rangeSlider={props.rangeSlider}/>
      {overrideDefaults && data.totalPages &&( <Pagination page={data.page}  totalPages={data.totalPages} searchParams={searchParams!} type={'tours'}/>)}
      
    </div>
  );
}