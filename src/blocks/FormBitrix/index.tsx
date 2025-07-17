import {  FormBitrixBlock, Media, RevistaBlock as RevistaBlockType } from "@/cms-types";
import BitrixFormLoader from "@/components/bitrixScript";
import { ImageCuadroLink } from "@/components/ImageCuadroLink";
import { Subtitle } from "@/components/Subtitle";
import YouTubeEmbed from "@/components/YoutubeEmbed";
import Script from "next/script";

interface Props extends FormBitrixBlock{
context?: {
    nameCollection:string
  }| null
}

export async function FormBitrix(props: Props) {
    const {trackingCode} = props

    console.log(props)
    return (
                <div className="w-full ">    
                <BitrixFormLoader/>
        </div>
    )
}