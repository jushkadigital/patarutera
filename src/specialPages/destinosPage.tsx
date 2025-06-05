import  { Fragment } from 'react'

import type { Media, Page } from '@/cms-types'
import { MediaBlock } from '../blocks/MediaBlock'
import { GridTours } from '../blocks/GridTours'
import { RowBlock } from '../blocks/RowBlock'
import { BannerBlock } from '@/blocks/Banner'
import { BASEURL } from '@/lib/config'
import { RenderHero } from '@/blocks/renderHeros'

import { LeftPanelSearch } from '@/components/leftPanelSearch'
import { SharedStateProvider } from '@/hooks/sharedContextDestinos'

const blockComponents = {
  gridTours: GridTours,
  mediaBlock: MediaBlock,
  rowBlock: RowBlock,
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
  if (!hasBlocksLayout && hasBlocksHero) {

    return (
      <div>
        <Fragment>
          {heroPageBlocks.map(async (block, index) => {
            const { blockType } = block
            switch (blockType) {
              case 'banner':
                {
                  //const respone = await fetch(`${BASEURL}/api/destinations?where[name][equals]=${destination}`)
                  //const data = await respone.json()
                  //const destinationData = data.docs[0]

                  return <BannerBlock {...block} title={destinationData.name} image={(destinationData.backgroundDestination as Media)} />
                }
            }
          })}
        </Fragment>
      </div>
    )
  }

  // Solo layout blocks
  if (hasBlocksLayout && !hasBlocksHero) {
    return (
      <div>
        <Fragment>
          {blocks.map(async (block, index) => {
            const { blockType } = block
            switch (blockType) {
              case 'gridTours':
                return <div className='my-16' key={index}>
                  <GridTours  {...block} gridColumns={6} />
                </div>
              default:
                return null
            }
          })}
        </Fragment>
      </div>
    )
  }

  // Ambos verdaderos
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
      <div className='flex flex-row'>
        <div className='w-1/4'>
          <LeftPanelSearch categories={categories} destinations={destinations} />
        </div>
        <div className='w-3/4'>
          <Fragment>
            {blocks.map(async (block, index) => {
              const { blockType } = block
              switch (blockType) {
                case 'gridTours':
                  return <div className='my-16' key={index}>
                    <GridTours  {...block} gridColumns={100} destination={destinationData} gridStyle={false} rangeSlider={true}/>
                  </div>
                default:
                  return null
              }
            })}
          </Fragment>

        </div>
      </div>
      </SharedStateProvider>
    </div>
  )
}