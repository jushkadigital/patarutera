import {  YouTubeLinksBlockType } from "@/cms-types";
import { Subtitle } from "@/components/Subtitle";
import YouTubeEmbed from "@/components/YoutubeEmbed";

interface Props extends YouTubeLinksBlockType{

}

export async function YouTubeLinksBlock(props: Props) {
    const {videoLinks,blockTitle} = props

    return (
        <div className="w-full ">    
        <Subtitle titleGroup={blockTitle}/>
        <div className="h-screen grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {
          videoLinks &&  videoLinks.map((ele)=>(
            <YouTubeEmbed key={ele.id} url={ele.url}/>
            ))
        }
            </div>
        </div>
    )
}