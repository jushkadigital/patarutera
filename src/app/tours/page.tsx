
import  { cache, Fragment } from 'react'

import type { GridToursBlock, Media, Page } from '@/cms-types'
import { MediaBlock } from '../../blocks/MediaBlock'
import { GridTours } from '../../blocks/GridTours'
import { RowBlock } from '../../blocks/RowBlock'
import { BannerBlock } from '@/blocks/Banner'
import { BASEURL } from '@/lib/config'
import { RenderHero } from '@/blocks/renderHeros'

import { LeftPanelSearch } from '@/components/leftPanelSearch'
import { SharedStateProvider } from '@/hooks/sharedContextDestinos'
import { CarouselDestinos } from '@/blocks/CarouselDestinos'
import { TikTokLinksBlock } from '@/blocks/TikToksLinksBlock'
import { ReconocimientosBlock } from '@/blocks/Reconocimientos'
import { OfertasBlock } from '@/blocks/OfertasBlock'
import { SociosBlock } from '@/blocks/Socios'
import { TextContentBlock } from '@/blocks/TextContent'
import { BeneficiosBlock } from '@/blocks/BeneficiosBlock'
import { EstadisticasBlock } from '@/blocks/Estadisticas'
import { DescrPriceBlock } from '@/blocks/DescPrice'
import { YouTubeLinksBlock } from '@/blocks/YoutubeLinksBlock'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { LivePreviewListener } from '@/components/LivePreviewListener'

const blockComponents = {
  gridTours: GridTours,
  mediaBlock: MediaBlock,
  rowBlock: RowBlock,
  carouselDestination: CarouselDestinos,
  tikTokLinks:TikTokLinksBlock,
  postRelationTour: null,
  reconocimientos: ReconocimientosBlock,
  ofertas: OfertasBlock,
  socios: SociosBlock,
  textContent: TextContentBlock,
  beneficios: BeneficiosBlock,
  estadisticas:EstadisticasBlock,
  gridImages: null,
  youTubeLinks: YouTubeLinksBlock,
}




export default async function Page(props: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { destination } =await props.searchParams
  const params = await props.searchParams
  const queryString = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (typeof value === 'string') {
        acc[key] = value
      } else if (Array.isArray(value)) {
        acc[key] = value[0] // o unirlos como acc[key] = value.join(',')
      }
      return acc
    }, {} as Record<string, string>)
  ).toString()
  const { isEnabled: draft } = await draftMode();
  const destinationRequest = await fetch(`${BASEURL}/api/destinations?where[name][equals]=${destination}`)
  const destinationDataPre = await destinationRequest.json()
  const destinationData = destinationDataPre.docs[0]
  let page: any;
  page = await queryPageBySlug(); 
    if (!page) {
      notFound();
    }

  const { layout: blocks, heroPageBlocks } = page
  const hasBlocksLayout = blocks && Array.isArray(blocks) && blocks.length > 0
  const hasBlocksHero = heroPageBlocks && Array.isArray(heroPageBlocks) && heroPageBlocks.length > 0

  const categoriesRequest = await fetch(`${BASEURL}/api/tourCategory`)
  const categoriesData = await categoriesRequest.json()
  const categories = categoriesData.docs
  const destinationsRequest = await fetch(`${BASEURL}/api/destinations`)
  const destinationsData = await destinationsRequest.json()
  const destinations = destinationsData.docs
  // Si ambos son falsos, fallback
  if (!hasBlocksLayout && !hasBlocksHero) {
    return <div>No hay contenido para mostrar.</div>
  }

  // Solo heroBlocks
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0
  
  const NoPadding = ['carouselDestination','reconocimientos','socios']

  return (
    <div>
    
         {draft&&<LivePreviewListener />}
      <Fragment>

        {heroPageBlocks!.map(async (block, index) => {
          const { blockType } = block
          switch (blockType) {
            case 'banner':
              {
                return <BannerBlock {...block} title={destinationData.name} image={(destinationData.backgroundDestination as Media)} />
              }
            default:
              return null
          }
        })}
      </Fragment>

      <SharedStateProvider>
      <div className='flex flex-row mt-10 w-[85%] mx-auto'>
        
        <LeftPanelSearch categories={categories} destinations={destinations} />
        <div className='lg:w-3/4'>
        <GridTours  {...blocks[0] as GridToursBlock} gridColumns={6} destination={destinationData} gridStyle={false} rangeSlider={true} searchParams={queryString}/>
        </div>
      </div>
      </SharedStateProvider>
      <div className='flex flex-col w-full'>
          <Fragment>
              {hasBlocks && blocks.slice(1).map((block, index) => {
          const { blockType } = block
          console.log(blockType)
          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className={!NoPadding.includes(blockType) ? 'w-full px-36 ' :'w-full'} key={index}>
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
          </Fragment>
      </div>
    </div>
  )
}


const queryPageBySlug = cache(async () => {
  const { isEnabled: draft } = await draftMode(); // draft is not used here, consider removing if not needed
  console.log(draft,'draftQuery')
  const data = await fetch(`${BASEURL}/api/globals/touP?depth=2&draft=${draft}`); // Added depth=2 for potentially richer layout data
  const result = await data.json();
  console.log(result)
  // console.log('queryBY');
  // console.log(result);
  return result || null;
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