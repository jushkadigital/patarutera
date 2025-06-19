import React from 'react'

import type { Page, Post } from '@/cms-types'

import {BannerBlock} from './Banner'
import { CarouselHero } from './CarouselHero'
import { TourHero } from './TourHero'

const blocks = {
  banner: BannerBlock,
}

export const RenderHero: React.FC<{heroBlocks:Post['heroPost']}> = (props) => {

  if (!props.heroBlocks || props.heroBlocks.length === 0) return null
    const hasBlocks = props.heroBlocks && Array.isArray(props.heroBlocks) && props.heroBlocks.length > 0
    console.log(hasBlocks)
    if (hasBlocks) {
  const HeroToRender = blocks[props.heroBlocks[0].blockType]
  
        return <HeroToRender {...props.heroBlocks[0]} />
        
    }


}