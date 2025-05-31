import React, { Fragment } from 'react'

import type { Page, Tour } from '@/cms-types'

import {BannerBlock} from './Banner'
import { CarouselHero } from './CarouselHero'
import { TourHero } from './TourHero'

const blocks = {
  tourHerocar: TourHero
}

export const RenderHero: React.FC<{heroBlocks:Tour['heroTour'],title:string}> = (props) => {
    console.log("WTF")
  if (!props.heroBlocks || props.heroBlocks.length === 0) return null
    console.log("WTF2")
    const hasBlocks = props.heroBlocks && Array.isArray(props.heroBlocks) && props.heroBlocks.length > 0
    console.log(hasBlocks)
    if (hasBlocks) {
  const HeroToRender = blocks[props.heroBlocks[0].blockType]
        return <Fragment>
          <HeroToRender {...props.heroBlocks[0]} />
          <div className='w-full'><h1 className='text-center text-4xl text-[#2970b7] font-bold italic'>{props.title}</h1></div>
          </Fragment>
        
    }


}