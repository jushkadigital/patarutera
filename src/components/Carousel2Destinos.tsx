"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { TitleGroup } from "@/cms-types"
import { Subtitle } from "./Subtitle"

interface SlideData {
  title: string
  button: string
  src: string
  bgImage: string
}

interface CustomCarouselProps {
  slides: SlideData[]
  titleObj: TitleGroup
}

export default function CustomCarousel({ slides,titleObj }: CustomCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const handlePrevious = () => {
    api?.scrollPrev()
  }

  const handleNext = () => {
    api?.scrollNext()
  }

  const handleSlideClick = (index: number) => {
    api?.scrollTo(index)
  }

  return (
    <div className="w-full h-[100vmin] mx-auto relative">
      {/* Carousel container with background */}
      <div className="w-full h-full rounded-3xl overflow-hidden relative">
        {/* Background image container */}
        <Subtitle titleGroup={titleObj} />
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence initial={false}>
            <motion.div
              key={current}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            >
              <img src={slides[current]?.bgImage || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          className="w-full h-full"
          opts={{
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent className="h-full items-center -ml-8">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="pl-8 basis-auto">
                <motion.div
                  className="flex flex-col items-center justify-center relative text-center text-white w-[70vmin] h-[70vmin] cursor-pointer"
                  onClick={() => handleSlideClick(index)}
                  animate={{
                    scale: current === index ? 1.1 : 0.85,
                  }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                  <motion.div className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden">
                    <motion.img
                      className="absolute inset-0 w-[120%] h-[120%] object-cover"
                      animate={{ opacity: current === index ? 1 : 0.3 }}
                      transition={{ duration: 0.6 }}
                      alt={slide.title}
                      src={slide.src}
                    />
                    {current === index && (
                      <motion.div
                        className="absolute inset-0 bg-black/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                      />
                    )}
                  </motion.div>

                  <motion.article
                    className="relative p-[4vmin]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: current === index ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: current === index ? 0.2 : 0 }}
                  >
                    <h2 className="text-lg md:text-2xl lg:text-4xl font-semibold relative">{slide.title}</h2>
                    <div className="flex justify-center">
                      <motion.button
                        className="mt-6 px-4 py-2 w-fit mx-auto sm:text-sm text-black bg-white h-12 border border-transparent text-xs flex justify-center items-center rounded-2xl shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {slide.button}
                      </motion.button>
                    </div>
                  </motion.article>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Custom Navigation Controls */}
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

          {/* Slide indicators */}
          <div className="absolute bottom-[130px] left-0 right-0 flex justify-center gap-2 z-20">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                className="w-2 h-2 rounded-full bg-white focus:outline-none"
                onClick={() => handleSlideClick(index)}
                animate={{
                  scale: current === index ? 1.5 : 1,
                  opacity: current === index ? 1 : 0.5,
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </div>
  )
}
