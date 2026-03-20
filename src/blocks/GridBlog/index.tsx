import type {
  BlogCategory,
  Destination,
  GridBlogsBlock,
  GridToursBlock as GridToursBlockType,
  Media,
  Post,
  Tour,
  TourCategory,
} from "@/cms-types";
import { PeruTravelBlogPage } from "@/components/Articles";
import { BlogsComponent } from "@/components/BlogsComponent";
import CardTour, { CardTourData } from "@/components/CardTour";
import { Pagination } from "@/components/Pagination";
import { Subtitle } from "@/components/Subtitle";
import { ToursComponent } from "@/components/ToursComponent";
import { useSharedState } from "@/hooks/sharedContextDestinos";
import { BASEURL } from "@/lib2/config";
import { cn } from "@/lib2/utils";

// Añadir 'mode' a las Props
interface Props extends GridBlogsBlock {
  page?: number;
  searchParams?: string;
  context?: {
    nameCollection: string;
  } | null;
}

export async function GridBlogs(props: Props) {
  // Usar la prop 'mode', con 'grid' como default
  const {
    id,
    limit,
    generalStyle,
    gridStyle: mode,
    categories,
    page,
    blockTitle,
    overrideDefaults,
    searchParams,
    populateBy,
    selectedDocs,
  } = props;

  let posts: any[] = [];
  let data;
  let fetchError = null;

  if (populateBy === "collection") {
    const paramsCat = new URLSearchParams();
    paramsCat.append("limit", String(limit));
    paramsCat.append("depth", "2");
    paramsCat.append("draft", "false");

    if (page) {
      paramsCat.append("page", String(page));
    }

    if ((categories as BlogCategory[]).length > 0) {
      paramsCat.append(
        "where[categories.name][in]",
        (categories as BlogCategory[]).map((c) => c.name).join(","),
      );
    }
    try {
      const response = await fetch(
        `${BASEURL}/api/posts?${paramsCat.toString()}`,
      );
      if (!response.ok) {
        // Consider logging the response status and text for more detailed error info
        // console.error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      data = await response.json();
      if (data && data.docs) {
        posts = data.docs;
      }
    } catch (error) {
      console.error("Error fetching tours:", error);
      // Podrías también lanzar el error para que un ErrorBoundary superior lo capture si es necesario
      // throw error;
    }
  } else {
    posts = selectedDocs
      ? selectedDocs!.map((ele) => ({
          title: (ele.value as Post).title,
          featuredImage: (ele.value as Post).featuredImage as Media,
          description: (ele.value as Post).description,
          slug: (ele.value as Post).slug!,
        }))
      : [];
  }

  const mode2 = false;
  // Clases condicionales basadas en la prop 'mode'
  const containerClasses = cn(
    mode
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      : "flex flex-col space-y-4 md:space-y-6 mx-auto w-[90%]",
  );

  if (fetchError) {
    return (
      <div className="container mx-auto py-8 text-center text-red-500">
        {fetchError}
      </div>
    );
  }

  return (
    // No hay controles de modo aquí porque es un Server Component
    <div className=" mx-auto py-4 bg bg-white w-[90%]">
      {/* Contenedor condicional */}
      <Subtitle className="" titleGroup={blockTitle} />
      {generalStyle == "masonry" ? (
        <PeruTravelBlogPage articles={posts} />
      ) : (
        <BlogsComponent mode={mode!} posts={posts} />
      )}
      {overrideDefaults && data.totalPages && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          searchParams={searchParams!}
          type={"posts"}
        />
      )}
    </div>
  );
}
