import React, { Fragment } from 'react'

import type { Page, Tour } from '@/cms-types'

import {BannerBlock} from './Banner'
import { CarouselHero } from './CarouselHero'
import { TourHero } from './TourHero'

const blocks = {
  paqueteHerocar: TourHero
}

export const RenderHero: React.FC<{heroBlocks:Tour['heroTour'],title:string}> = (props) => {
  if (!props.heroBlocks || props.heroBlocks.length === 0) return null
    const hasBlocks = props.heroBlocks && Array.isArray(props.heroBlocks) && props.heroBlocks.length > 0
    console.log(hasBlocks)
    if (hasBlocks) {
  const HeroToRender = blocks[props.heroBlocks[0].blockType]
        return <Fragment>
          <HeroToRender {...props.heroBlocks[0]} />
          </Fragment>
    }


}