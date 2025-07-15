'use client'
import React, { PropsWithChildren } from 'react';
import {
  Carousel as ShadCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from '@/components/ui/carousel';
import { motion, AnimatePresence } from "motion/react"
import Autoplay from "embla-carousel-autoplay"

interface CarouselProps extends PropsWithChildren<object> {
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ children, className = '' }) => {
const [api, setApi] = React.useState<CarouselApi>()

  React.useEffect(() => {
    if (!api) {
      return
    }


    api.on("select", () => {
    })
  }, [api])

const handlePrevious = () => {
    api?.scrollPrev()
  }

  const handleNext = () => {
    api?.scrollNext()
  }

   const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  )
  return (
    <ShadCarousel 
    plugins={[plugin.current]}
    onMouseEnter={plugin.current.stop}
    onMouseLeave={plugin.current.reset}
    setApi={setApi}
          className="w-full h-full"
          opts={{
            align: "center",
            loop: true,
          }}
        >
      <CarouselContent>
        {React.Children.map(children, (child, idx) => (
          <CarouselItem key={idx} className="w-full flex flex-row justify-center items-center">
            {child}
          </CarouselItem>
        ))}
      </CarouselContent>
      <motion.button
            className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white text-3xl font-light border-none bg-transparent focus:outline-none z-20"
            onClick={handlePrevious}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            ‹
          </motion.button>

          <motion.button
            className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white text-3xl font-light border-none bg-transparent focus:outline-none z-20"
            onClick={handleNext}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            ›
          </motion.button>
    </ShadCarousel>
  );
};
