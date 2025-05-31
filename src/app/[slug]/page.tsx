import { RenderBlocks } from '@/blocks/renderBlocks';
import { RenderHero } from '@/blocks/renderHeros';
import { LivePreviewListener } from '@/components/LivePreviewListener';
import { BASEURL } from '@/lib/config';
import { DestinosPage } from '@/specialPages/destinosPage';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { cache } from 'react';

// --- 1. Import your Special Page Components ---
// (Replace with your actual component paths and names)
// import OfertasPageComponent from '@/components/special/OfertasPage';
// import PaquetesEspecialesPageComponent from '@/components/special/PaquetesEspecialesPage';
// import OtroComponenteEspecial from '@/components/special/OtroComponenteEspecial';

// --- 2. Define the Slug-to-Component Mapping ---
// (This maps slugs to the actual component functions)
const specialPageComponents: { [key: string]: React.ComponentType<any> } = {
  // 'ofertas': OfertasPageComponent,
  // 'paquetes-especiales': PaquetesEspecialesPageComponent,
  // 'otro-slug-especial': OtroComponenteEspecial,
  // Add more mappings as needed
  'destinos': DestinosPage,
};

// Assume slugsEspeciales is defined here or imported
// const slugsEspeciales = ['ofertas', 'paquetes-especiales'];

const slugsEspeciales = Object.keys(specialPageComponents); // Get special slugs from the mapping

export async function generateStaticParams() {
  const pagesRequest = await fetch(`${BASEURL}/api/pages?depth=3&limit=1000&draft=false&select[slug]=true`)
  
  const pages = await pagesRequest.json()
  // console.log(pages)

  const params = pages.docs
    ?.filter((doc: any) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }: any) => {
      return { slug }
    })

  return params || [];
}


type PageParams = {
  slug?: string;
  isSpecialPage?: boolean;
  mapsToComponent?: boolean; // Indicates if a special component should be rendered
  // Add any other params you expect
};

type Args = {
  params: Promise<PageParams>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const resolvedParams = await paramsPromise;
  const searchParams = await searchParamsPromise;
  const { slug = 'home' } = resolvedParams;
  console.log(draft,'draft')
  // console.log('Slug:', slug);
  // console.log('Maps to Component:', mapsToComponent);

  let page: any;
  // --- 3. Conditionally Render Special Component or Standard Layout ---
  if (slugsEspeciales.includes(slug)) {
    const SpecialComponent = specialPageComponents[slug];
    
    // You might still want to fetch some common page data or specific data for the special component
    page = await queryPageBySlug({ slug }); 
    if (!page) {
      notFound();
    }
    // Pass necessary props to your special component, e.g., page data
    return <SpecialComponent pageData={page} resolvedParams={resolvedParams} searchParams={searchParams} />;
  } else {
    // Standard logic for non-special pages or special pages that don't map to a full component
    page = await queryPageBySlug({
      slug,
    });

    if (!page) {
      notFound();
    }

    const { layout,heroPageBlocks } = page;
    // console.log(layout);

    return (
      <div className="flex flex-col space-y-10">
         {draft&&<LivePreviewListener />}
        <RenderHero heroBlocks={heroPageBlocks} />
        <RenderBlocks blocks={layout} />
      </div>
    );
  }
}


const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode(); // draft is not used here, consider removing if not needed
  console.log(draft,'draftQuery')
  const data = await fetch(`${BASEURL}/api/pages?limit=1&where[slug][equals]=${slug}&depth=2&draft=${draft}`); // Added depth=2 for potentially richer layout data

  const result = await data.json();
  // console.log('queryBY');
  // console.log(result);
  return result.docs?.[0] || null;
});

// Optional: Metadata for the page
// export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
//   const { slug } = params;
//   const pageData = await getPageDataBySlug(slug);
//   if (!pageData) {
//     return { title: "Page Not Found" };
//   }
//   return {
//     title: `${pageData.title || 'Page'} | Patarutera`,
//     // description: pageData.seoDescription || defaultDescription,
//   };
// } 