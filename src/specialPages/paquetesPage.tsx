import  { Fragment } from 'react'

import type { GridPaquetesBlock, Media, Page } from '@/cms-types'
import { MediaBlock } from '../blocks/MediaBlock'
import { GridTours } from '../blocks/GridTours'
import { RowBlock } from '../blocks/RowBlock'
import { BannerBlock } from '@/blocks/Banner'
import { BASEURL } from '@/lib/config'
import { RenderHero } from '@/blocks/renderHeros'
import { LeftPanelSearchPaquete } from '@/components/leftSearchPanelPaquetes'
import { GridPaquetes } from '@/blocks/GridPaquetes'


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

export async function PaquetesPage(props: {
  pageData: Page,
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { destinations } = props.searchParams
  console.log(destinations)
  const destinationRequest = await fetch(`${BASEURL}/api/destinations?where[name][in]=${destinations}`)
  const destinationDataPre = await destinationRequest.json()
  const destinationData = destinationDataPre.docs
  const { layout: blocks, heroPageBlocks } = props.pageData
  const hasBlocksLayout = blocks && Array.isArray(blocks) && blocks.length > 0
  const hasBlocksHero = heroPageBlocks && Array.isArray(heroPageBlocks) && heroPageBlocks.length > 0

  const destinationsRequest = await fetch(`${BASEURL}/api/destinations`)
  const destinationsData = await destinationsRequest.json()
  const destinationsDataFinal = destinationsData.docs
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
                  return <BannerBlock {...block} title={'Paquete'} image={(destinationsDataFinal[0].backgroundDestination as Media)} />
              }
            default:
              return null
          }
        })}
      </Fragment>

      <SharedStateProvider>
      <div className='flex flex-row mt-10'>
          <LeftPanelSearchPaquete destinations={destinationsDataFinal} />
        <div className='lg:w-3/4'>
        <GridPaquetes  {...blocks[0] as GridPaquetesBlock} destination={destinationData} gridColumns={100} gridStyle={false} rangeSlider={true}/>
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