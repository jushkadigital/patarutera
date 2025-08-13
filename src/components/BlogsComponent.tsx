'use client'
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/useMobile";
import CardPost, { CardPostData } from "./CardPost";

interface Props {
    posts:CardPostData[]
    mode: boolean
}
export function BlogsComponent({posts,mode}:Props){

    const containerClasses = cn(
    mode
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
      : 'flex flex-col space-y-4 md:space-y-6 mx-auto w-[90%]'
  );


  const responsive = useMobile({breakpoint:480})
  console.log(posts)

    return (
        <div className={containerClasses}>
        {posts.length > 0 ? (
          posts.map((tour) => (
            // Pasar la prop 'mode' a CardTour
            // Asegurarse que tour.slug existe y es único. Si no, usar tour.id u otro identificador único.
            <CardPost key={tour.id} unitData={tour} mode={mode ? 'grid' : 'list'} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">Proximamente vendran nuevos Tours</p>
        )}
      </div>
    )
}