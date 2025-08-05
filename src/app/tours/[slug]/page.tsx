import { RenderBlocks } from '@/blocks/renderBlocks';
import { RenderHero } from '@/blocks/renderTourHero';
import { LivePreviewListener } from '@/components/LivePreviewListener';
import { BASEURL } from '@/lib/config';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { cache } from 'react';

export async function generateStaticParams() {
  const toursRequest = await fetch(`${BASEURL}/api/tours?depth=0&limit=1000&draft=false&select[slug]=true`); // Fetch tour slugs
  const tours = await toursRequest.json();

  const params = tours.docs
    ?.filter((doc: any) => doc.slug) // Ensure slug exists
    .map(({ slug }: any) => ({ slug }));

  return params || [];
}

type TourPageParams = {
  slug?: string;
  // Add any other params specific to tours if needed
};

type Args = {
  params: Promise<TourPageParams>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function TourPage({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const resolvedParams = await paramsPromise;
  // const searchParams = await searchParamsPromise; // Uncomment if searchParams are needed for tours
  const { slug } = resolvedParams;

  if (!slug) {
    notFound(); // Should be handled by Next.js routing if slug is missing, but good practice
  }

  const tour = await queryTourBySlug({ slug });

  if (!tour) {
    notFound();
  }

  const { layout, heroTour ,title} = tour; // Assuming tours have layout and heroPageBlocks

  return (
    <div className="">
      {draft && <LivePreviewListener />}
      <div className="flex flex-col-reverse md:flex-col mt-10 md:mt-0">
      <RenderHero heroBlocks={heroTour} title={title}/>
      <div className='flex flex-col space-y-10'>
      <div className='w-full'><h1 className='text-center text-4xl lg:text-[clamp(16.3px,2.6vw,50.72px)]  text-[#2970b7] font-bold italic'>{title}</h1></div>
      <RenderBlocks blocks={layout} context={{nameCollection: 'tour',title:title}} />
      </div>
      </div>
      
    </div>
  );
}

const queryTourBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode();
  // Fetch a single tour by slug. Adjust depth as needed for tour data.
  const data = await fetch(`${BASEURL}/api/tours?limit=1&where[slug][equals]=${slug}&depth=2&draft=${draft}`);
  const result = await data.json();
  return result.docs?.[0] || null;
});

// Optional: Metadata for the tour page
// import { Metadata } from 'next'; // Uncomment if using metadata
// export async function generateMetadata({ params }: Args): Promise<Metadata> {
//   const resolvedParams = await params.params; // Access the nested params
//   const { slug } = resolvedParams;
//   const tour = await queryTourBySlug({ slug: slug || '' });
//   if (!tour) {
//     return { title: "Tour Not Found" };
//   }
//   return {
//     title: `${tour.title || 'Tour'} | Patarutera`, // Assuming tour has a title
//     // description: tour.seoDescription || defaultDescription, // Assuming tour has seoDescription
//   };
// }
