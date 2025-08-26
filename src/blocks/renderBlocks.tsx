import React, { Fragment } from 'react'
import type { Page, Paquete, Tour } from '@/cms-types'
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
import { GridPaquetes } from './GridPaquetes'
import { RevistaBlock } from './RevistaBlock'
import { FormBitrix } from './FormBitrix'
import { GridBlogs } from './GridBlog'
import { AdicionalBlock } from './AdicionalBlock'
import { DataTourBlock } from './DataTour'

const blockComponents = {
  gridTours: GridTours,
  gridPaquetes: GridPaquetes,
  gridBlogs: GridBlogs,
  mediaBlock: MediaBlock,
  rowBlock: RowBlock,
  carouselDestination: CarouselDestinos,
  tikTokLinks: TikTokLinksBlock,
  postRelationTour: null,
  reconocimientos: ReconocimientosBlock,
  ofertas: OfertasBlock,
  socios: SociosBlock,
  textContent: TextContentBlock,
  beneficios: BeneficiosBlock,
  estadisticas: EstadisticasBlock,
  gridImages: null,
  descrPrice: DescrPriceBlock,
  youTubeLinks: YouTubeLinksBlock,
  guiaTour: GuiaTour,
  revistaBlock: RevistaBlock,
  formBitrixBlock: FormBitrix,
  adicionalTour: AdicionalBlock,
  dataTour: DataTourBlock
}



export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][] | NonNullable<Tour['layout']>[0][] | Paquete['layout'][0][],
  context?: { nameCollection: string, title: string }
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  const NoPadding = ['carouselDestination', 'reconocimientos', 'socios']

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
                <div className={!NoPadding.includes(blockType) ? 'w-full px-[clamp(25px,6.6vw,155px)] lg:px-[clamp(136px,13.33vw,256px)]' : 'w-full'} key={index}>
                  <Block {...block} disableInnerContainer context={props.context} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  } else {
    return <div> No contenido</div>
  }
}
