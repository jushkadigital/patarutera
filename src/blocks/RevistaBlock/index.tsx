'use client'
import { Media, RevistaBlock as RevistaBlockType } from "@/cms-types";
import { ImageCuadroLink } from "@/components/ImageCuadroLink";
import { Subtitle } from "@/components/Subtitle";
import { Button } from "@/components/ui/button";
import YouTubeEmbed from "@/components/YoutubeEmbed";
import { useMobile } from "@/hooks/useMobile";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props extends RevistaBlockType {
  context?: {
    nameCollection: string
  } | null
}

export function RevistaBlock(props: Props) {
  const { revistasLinks, blockTitle } = props

  const isMobile = useMobile()
  return (
    <div className="w-full ">
      <Subtitle titleGroup={blockTitle} />
      {
        !isMobile ?
          <div className="flex flex-row">
            {
              revistasLinks && revistasLinks.map(ele => (
                <ImageCuadroLink backgroundImage={(ele.image! as Media)} link={ele.url} text="Ver Revista" />
              ))
            }
          </div>
          :
          <div className="flex flex-row">
            {
              revistasLinks && revistasLinks.map(ele =>
                <Button className="w-44 bg-white mx-auto">
                  <Link href={ele.url} className=" flex items-center text-gray-500">
                    Descargar Brouchere
                    <ChevronRight />
                  </Link>
                </Button>
              )
            }
          </div>

      }
    </div>
  )
}
