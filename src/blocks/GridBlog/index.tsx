import type { Destination, GridBlogsBlock, GridToursBlock as GridToursBlockType, Tour, TourCategory } from '@/cms-types';
import { GridBlogComponent } from '@/components/Articles';
import CardTour, { CardTourData } from '@/components/CardTour';
import { Subtitle } from '@/components/Subtitle';
import { ToursComponent } from '@/components/ToursComponent';
import { useSharedState } from '@/hooks/sharedContextDestinos';
import { BASEURL } from '@/lib/config';
import { cn } from '@/lib/utils';

// Añadir 'mode' a las Props
interface Props extends GridBlogsBlock {
}

export async function GridTours(props: Props) {
  // Usar la prop 'mode', con 'grid' como default
  const { id, limit,generalStyle, gridStyle:mode  ,categories,blockTitle} = props;



  console.log(mode)
  let posts = [];
  let fetchError = null;
  try {
    
   const response = await fetch( `${BASEURL}/api/posts?limit=${limit}&depth=2&draft=false&select[featuredImage]=true&select[slug]=true&select[title]=true&select[price]=true&select[Desde]=true&select[difficulty]=true&select[iconDifficulty]=true&select[maxPassengers]=true&select[iconMaxPassengers]=true&select[Person desc]=true&select[miniDescription]=true&select[destinos]=true&where[categories.name][in]=${(categories as TourCategory[]).map(c => c.name).join(',')}`);
    if (!response.ok) {
        // Consider logging the response status and text for more detailed error info
        // console.error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data && data.docs) {
      posts = data.docs;
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
  


  return (
    // No hay controles de modo aquí porque es un Server Component
    <div className=" mx-auto py-4 bg bg-white w-[90%]">
      {/* Contenedor condicional */}
      <Subtitle className="" titleGroup={blockTitle}/>
      {generalStyle == "masonry" ? 
      <GridBlogComponent articles={posts.map((ele:any)=>({
  id: ele.id,
  slug: ele.slug,
  title: ele.title,
  imageUrl: ele.featuredImage.url,
  imageQuery: ele.featuredImage.alt,
  description: ele.description
          }))}/>
      :
      <div></div>
      }
      
    </div>
  );
}