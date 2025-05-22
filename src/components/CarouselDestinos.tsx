"use client"

import type React from "react"

import { useState, useId } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Subtitle } from "./Subtitle"
import { TitleGroup } from "@/cms-types"

interface SlideData {
  title: string
  button: string
  src: string
  bgImage: string
}

interface SlideProps {
  slide: SlideData
  index: number
  current: number
  handleSlideClick: (index: number) => void
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
  const { src, button, title } = slide

  const variants = {
    inactive: {
      scale: 0.85,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
    active: {
      scale: 1.1,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0, transition: { duration: 0.3 } },
    visible: { opacity: 1, transition: { duration: 0.5, delay: 0.2 } },
  }

  return (
    <motion.div className="[perspective:1200px] [transform-style:preserve-3d] flex-shrink-0">
      <motion.li
        className="flex flex-col items-center justify-center relative text-center text-white w-[70vmin] h-[70vmin] mx-[2vmin] z-10"
        onClick={() => handleSlideClick(index)}
        variants={variants}
        animate={current === index ? "active" : "inactive"}
        initial="inactive"
      >
        <motion.div className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden">
          <motion.img
            className="absolute inset-0 w-[120%] h-[120%] object-cover"
            animate={{ opacity: current === index ? 1 : 0.3 }}
            transition={{ duration: 0.6 }}
            alt={title}
            src={src}
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
          variants={contentVariants}
          initial="hidden"
          animate={current === index ? "visible" : "hidden"}
        >
          <h2 className="text-lg md:text-2xl lg:text-4xl font-semibold relative">{title}</h2>
          <div className="flex justify-center">
            <motion.button
              className="mt-6 px-4 py-2 w-fit mx-auto sm:text-sm text-black bg-white h-12 border border-transparent text-xs flex justify-center items-center rounded-2xl shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              {button}
            </motion.button>
          </div>
        </motion.article>
      </motion.li>
    </motion.div>
  )
}

interface CarouselControlProps {
  type: string
  title: string
  handleClick: () => void
}

const CarouselControl = ({ type, title, handleClick }: CarouselControlProps) => {
  return (
    <motion.button
      className="w-12 h-12 flex items-center justify-center text-white text-3xl font-light border-none bg-transparent focus:outline-none"
      title={title}
      onClick={handleClick}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
    >
      {type === "previous" ? "‹" : "›"}
    </motion.button>
  )
}

interface CarouselProps {
  slides: SlideData[]
  titleObj: TitleGroup
}

export default function Carousel({ slides ,titleObj}: CarouselProps) {
  const [current, setCurrent] = useState(0)
  const id = useId()

  const handlePreviousClick = () => {
    const previous = current - 1
    setCurrent(previous < 0 ? slides.length - 1 : previous)
  }

  const handleNextClick = () => {
    const next = current + 1
    setCurrent(next === slides.length ? 0 : next)
  }

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index)
    }
  }

  // For touch gestures
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNextClick()
    } else if (isRightSwipe) {
      handlePreviousClick()
    }
  }

  return (
    <div className="w-full h-screen mx-auto relative">
      
      {/* Carousel container with background */}
      <div
        className="w-full h-full rounded-3xl overflow-hidden relative"
        aria-labelledby={`carousel-heading-${id}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Background image container */}
        <div className="absolute inset-0 w-full h-full">
        <Subtitle className="" titleGroup={titleObj}/>
          <AnimatePresence initial={false}>
            <motion.div
              key={current}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            >
              <img src={slides[current].bgImage || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slides */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <motion.ul
            className="flex items-center"
            animate={{
              x: `calc(50% - ${current * 74}vmin - 37vmin)`,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            style={{
              width: `${slides.length * 74}vmin`,
            }}
          >
            {slides.map((slide, index) => (
              <Slide key={index} slide={slide} index={index} current={current} handleSlideClick={handleSlideClick} />
            ))}
          </motion.ul>
        </div>

        {/* Navigation controls */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between w-full px-4 z-20">
          <CarouselControl type="previous" title="Go to previous slide" handleClick={handlePreviousClick} />
          <CarouselControl type="next" title="Go to next slide" handleClick={handleNextClick} />
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              className="w-2 h-2 rounded-full bg-white focus:outline-none"
              onClick={() => setCurrent(index)}
              animate={{
                scale: current === index ? 1.5 : 1,
                opacity: current === index ? 1 : 0.5,
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
