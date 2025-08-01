import { TikTokLinksBlockType } from "@/cms-types";
import OptimizedVideoPlayer from "@/components/OptimizedVideoPlayer";
import { Subtitle } from "@/components/Subtitle";
import TiktokEmbed from "@/components/TiktokEmbed";

interface Props extends TikTokLinksBlockType{
context?: {
    nameCollection:string
  }| null
}

export async function TikTokLinksBlock(props: Props) {
    const {videoLinks,blockTitle} = props

    return (
        <div className="w-full ">    
        <Subtitle titleGroup={blockTitle}/>
        <div className="h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 md:gap-6">
        {
          videoLinks &&  videoLinks.map((ele,index)=> index == 3 ?(
            <TiktokEmbed key={ele.id} url={ele.url} className="hidden"/>
            ): 
            
            <TiktokEmbed key={ele.id} url={ele.url} className=""/>
          )
        }
            </div>
        </div>
    )
}