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
import { OfertasBlock } from './OfertasBlock'

const blockComponents = {
  gridTours: GridTours,
  mediaBlock: MediaBlock,
  carouselDestination: CarouselDestinos,
  tikTokLinks:TikTokLinksBlock,
  postRelationTour: null,
  reconocimientos: null,
  ofertas: OfertasBlock,
  socios: null,
  textContent: TextContentBlock,
  beneficios: BeneficiosBlock,
  estadisticas:EstadisticasBlock,
  gridImages: GridImages
}



export const RenderBlocksRow: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

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
                <div className="w-full h-full" key={index}>
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