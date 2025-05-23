import { TikTokLinksBlockType } from "@/cms-types";
import OptimizedVideoPlayer from "@/components/OptimizedVideoPlayer";

interface Props extends TikTokLinksBlockType{

}

export async function TikTokLinksBlock(props: Props) {
    const {videoLinks} = props

    return (
        <div className="h-screen">
            <div>HOLAA</div>
        {
          videoLinks &&  videoLinks.map((ele)=>(
                <OptimizedVideoPlayer videoUrl={ele.url}/>
            ))
        }

            </div>
    )
}