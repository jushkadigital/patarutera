import {  Media, RevistaBlock as RevistaBlockType } from "@/cms-types";
import { ImageCuadroLink } from "@/components/ImageCuadroLink";
import { Subtitle } from "@/components/Subtitle";
import YouTubeEmbed from "@/components/YoutubeEmbed";

interface Props extends RevistaBlockType{

}

export async function RevistaBlock(props: Props) {
    const {revistasLinks,blockTitle} = props

    return (
        <div className="w-full ">    
        <Subtitle titleGroup={blockTitle}/>
        <div className="h-screen grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {
          revistasLinks && revistasLinks.map(ele=>(
            <ImageCuadroLink backgroundImage={(ele.image! as Media).url!} link={ele.url} text="Ver Revista"/>
          ))
        }
            </div>
        </div>
    )
}