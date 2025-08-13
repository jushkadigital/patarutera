import type { BlogCategory, Destination, GridBlogsBlock, GridToursBlock as GridToursBlockType, Tour, TourCategory } from '@/cms-types';
import { PeruTravelBlogPage } from '@/components/Articles';
import { BlogsComponent } from '@/components/BlogsComponent';
import CardTour, { CardTourData } from '@/components/CardTour';
import { Pagination } from '@/components/Pagination';
import { Subtitle } from '@/components/Subtitle';
import { ToursComponent } from '@/components/ToursComponent';
import { useSharedState } from '@/hooks/sharedContextDestinos';
import { BASEURL } from '@/lib/config';
import { cn } from '@/lib/utils';

// Añadir 'mode' a las Props
interface Props extends GridBlogsBlock {
  page?: number
  searchParams?: string
  context?: {
    nameCollection:string
  }| null
}

export async function GridBlogs(props: Props) {
  // Usar la prop 'mode', con 'grid' como default
  const { id, limit,generalStyle, gridStyle:mode ,categories,page,blockTitle,overrideDefaults,searchParams} = props;



  console.log(mode)
  let posts = [];
  let data
  let fetchError = null;
  
  const paramsCat = new URLSearchParams()
  console.log(categories)
  if((categories as BlogCategory[]).length > 0){
        paramsCat.append('where[categories.name][in]', (categories as BlogCategory[]).map(c => c.name).join(','))
    }
  try {
    
    const queryStringCat = paramsCat.toString()
    console.log(queryStringCat)
  const pageNumber = page ? `&page=${page}` : ''
   const response = await fetch(`${BASEURL}/api/posts?limit=${limit}${pageNumber}&depth=2&draft=false&select[featuredImage]=true&select[slug]=true&select[title]=true&select[description]=true&${queryStringCat}`);
    if (!response.ok) {
        // Consider logging the response status and text for more detailed error info
        // console.error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    data = await response.json();
    if (data && data.docs) {
      posts = data.docs;
    }
    console.log(data)
    console.log(data.totalPages)
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
  
  console.log(data)

  return (
    // No hay controles de modo aquí porque es un Server Component
    <div className=" mx-auto py-4 bg bg-white w-[90%]">
      {/* Contenedor condicional */}
      <Subtitle className="" titleGroup={blockTitle}/>
      {generalStyle == "masonry" ? 
      <PeruTravelBlogPage articles={posts}/>
      :
      <BlogsComponent mode={mode!} posts={posts}/>
      }
      {overrideDefaults && data.totalPages &&( <Pagination page={data.page}  totalPages={data.totalPages} searchParams={searchParams!} type={'posts'}/>)}
    </div>
  );
}