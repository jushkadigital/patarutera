import React, { Fragment } from "react";

import type { Page, Paquete } from "@/cms-types";

import { BannerBlock } from "./Banner";
import { CarouselHero } from "./CarouselHero";
import { TourHero } from "./TourHero";

const blocks = {
  paqueteHerocar: TourHero,
};

export const RenderHero: React.FC<{
  heroBlocks: Paquete["heroPaquete"];
  title: string;
}> = (props) => {
  const hasBlocks =
    props.heroBlocks &&
    Array.isArray(props.heroBlocks) &&
    props.heroBlocks.length > 0;
  if (hasBlocks) {
    const HeroToRender = blocks[props.heroBlocks![0].blockType];
    return <HeroToRender {...props.heroBlocks![0]} />;
  } else {
    return <div> No contenido</div>;
  }
};
