'use client'
import { AnimatePresence, motion } from "motion/react"
import SVGPeru from "@/components/IconsSvg/Peru"
import { useState } from "react"
import { DestinoPopUp } from "@/components/DestinoPopUp"
import { Destination } from "@/cms-types"

interface Props {
  data: Destination[]
}
function toUppercase(str: string) {
  // Check if the input is a string
  return str.toUpperCase();
}


export function ContextSvg({ data }: Props) {

  const [hoverDept, setHoverDept] = useState<string>("Cusco")

  const [isVisible, setIsVisible] = useState(false)

  const val = data.find(ele => toUppercase(ele.name) == toUppercase(hoverDept))

  const currentsRegions = data.map(ele => toUppercase(ele.name))
  console.log(currentsRegions)
  console.log(val)

  return (
    <div className="flex flex-col md:flex-row">
      <SVGPeru setRegion={setHoverDept} setVisible={setIsVisible} allowedRegions={currentsRegions} />
      <div className="flex flex-col justify-center">
        <AnimatePresence initial={false}>

          {isVisible ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="box"
              className="relative w-[400px] h-[200px] md:h-auto"
            >
              <DestinoPopUp data={val as Destination} />
            </motion.div>
          ) : <div className="  w-[400px]  h-[200px] md:h-auto"></div>}
        </AnimatePresence>
      </div>
    </div>
  )

}
