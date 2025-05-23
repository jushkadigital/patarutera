import React, { Fragment } from 'react'
import type { Page } from '@/cms-types'
import { MediaBlock } from './MediaBlock'
import { GridTours } from './GridTours'
import { RowBlock } from './RowBlock'
import { CarouselDestinos } from './CarouselDestinos'
import { TikTokLinksBlock } from './TikToksLinksBlock'

const blockComponents = {
  gridTours: GridTours,
  mediaBlock: MediaBlock,
  rowBlock: RowBlock,
  carouselDestination: CarouselDestinos,
  tikTokLinks:TikTokLinksBlock,
  postRelationTour: null,
  reconocimientos: null,
  ofertas: null,
  socios: null,
}



export const RenderBlocks: React.FC<{
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
                <div className="" key={index}>
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