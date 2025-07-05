import  { Fragment } from 'react'

import type { GridToursBlock, Media, Page } from '@/cms-types'
import { MediaBlock } from '../blocks/MediaBlock'
import { GridTours } from '../blocks/GridTours'
import { RowBlock } from '../blocks/RowBlock'
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

export async function DestinosPage(props: {
  pageData: Page,
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { destination } = props.searchParams
  const destinationRequest = await fetch(`${BASEURL}/api/destinations?where[name][equals]=${destination}`)
  const destinationDataPre = await destinationRequest.json()
  const destinationData = destinationDataPre.docs[0]
  const { layout: blocks, heroPageBlocks } = props.pageData
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
        <GridTours  {...blocks[0] as GridToursBlock} gridColumns={100} destination={destinationData} gridStyle={false} rangeSlider={true}/>
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