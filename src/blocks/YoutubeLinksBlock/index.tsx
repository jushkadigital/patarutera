import {  Media, YouTubeLinksBlockType } from "@/cms-types";
import { ImageCuadroLink } from "@/components/ImageCuadroLink";
import { Subtitle } from "@/components/Subtitle";
import YouTubeEmbed from "@/components/YoutubeEmbed";

interface Props extends YouTubeLinksBlockType{

}

export async function YouTubeLinksBlock(props: Props) {
    const {videoLinks,blockTitle} = props

    console.log("IM HEREE")
    return (
        <div className="w-full ">    
        <Subtitle titleGroup={blockTitle}/>
        <div className="flex flex-row">
        {
          videoLinks &&  videoLinks.map((ele)=>(
            <ImageCuadroLink backgroundImage={(ele.image! as Media).url!} link={ele.url} text="Ver Video"/>
            ))
        }
            </div>
        </div>
    )
}