'use client'

import { Destination } from "@/cms-types"
import CardPost, { CardPostData } from "./CardPost"
import { title } from "process"
import CardDestino from "./CardDestino"
import { useMobile } from "@/hooks/useMobile"

interface Props {
  data: Destination
}

export const DestinoPopUp = ({ data }: Props) => {

  console.log(data)

  const newValue = {
    id: data.id,
    title: data.name,
    slug: '',
    description: data.description,
    featuredImage: data.carouselItemDestination
  }

  const isMobile = useMobile({ breakpoint: 767 })

  return (
    <CardDestino unitData={newValue as CardPostData} mode={isMobile ? 'list' : 'grid'} />
  )

}
