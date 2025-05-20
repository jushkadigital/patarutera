import React from 'react'

import type { Page } from '@/cms-types'

import {BannerBlock} from './Banner'
import { CarouselHero } from './CarouselHero'

const blocks = {
  banner: BannerBlock,
  carouselHeroPage: CarouselHero,
}

export const RenderHero: React.FC<{heroBlocks:Page['heroPageBlocks']}> = (props) => {

  if (!props.heroBlocks || props.heroBlocks.length === 0) return null
    const hasBlocks = props.heroBlocks && Array.isArray(props.heroBlocks) && props.heroBlocks.length > 0
    console.log(hasBlocks)
    if (hasBlocks) {
  const HeroToRender = blocks[props.heroBlocks[0].blockType]
  
      {/* @ts-expect-error there may be some mismatch between the expected types here */}
        return <HeroToRender {...props.heroBlocks[0]} />
        
    }


}