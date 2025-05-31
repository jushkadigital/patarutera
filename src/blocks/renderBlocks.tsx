import React, { Fragment } from 'react'
import type { Page } from '@/cms-types'
import { MediaBlock } from './MediaBlock'
import { GridTours } from './GridTours'
import { RowBlock } from './RowBlock'
import { CarouselDestinos } from './CarouselDestinos'
import { TikTokLinksBlock } from './TikToksLinksBlock'
import { TextContentBlock } from './TextContent'
import { BeneficiosBlock } from './BeneficiosBlock'
import { EstadisticasBlock } from './Estadisticas'
import { GridImages } from './GridImages'
import { SociosBlock } from './Socios'
import { OfertasBlock } from './OfertasBlock'
import { ReconocimientosBlock } from './Reconocimientos'
import { DescrPriceBlock } from './DescPrice'
import { YouTubeLinksBlock } from './YoutubeLinksBlock'
import { GuiaTour } from './GuiaTourBlock'

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
  descrPrice: DescrPriceBlock,
  youTubeLinks: YouTubeLinksBlock,
  guiaTour: GuiaTour
}



export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  const NoPadding = ['carouselDestination','reconocimientos','socios']

   if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block
          console.log(blockType)
          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className={!NoPadding.includes(blockType) ? 'w-full px-36' :''} key={index}>
   {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }
}