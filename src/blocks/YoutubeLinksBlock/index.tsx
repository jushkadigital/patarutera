'use client'
import { Media, YouTubeLinksBlockType } from "@/cms-types";
import { ImageCuadroLink } from "@/components/ImageCuadroLink";
import { Subtitle } from "@/components/Subtitle";
import { Button } from "@/components/ui/button";
import YouTubeEmbed from "@/components/YoutubeEmbed";
import { useMobile } from "@/hooks/useMobile";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props extends YouTubeLinksBlockType {
  context?: {
    nameCollection: string
  } | null
}

export function YouTubeLinksBlock(props: Props) {
  const { videoLinks, blockTitle } = props

  const isMobile = useMobile()
  console.log("IM HEREE")
  return (
    <div className="w-full ">
      <Subtitle titleGroup={blockTitle} />

      {!isMobile ?
        <div className="flex flex-row">
          {
            videoLinks && videoLinks.map((ele) => (
              <ImageCuadroLink backgroundImage={(ele.image! as Media)} link={ele.url} text="Ver Video" />
            ))
          }
        </div>

        :
        <div className="flex flex-row">
          {
            videoLinks && videoLinks.map(ele =>
              <Button asChild className="w-44 bg-[#2970B7] mx-auto">
                <Link href={ele.url} className="flex items-center">
                  Ver Video

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
