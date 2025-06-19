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
        <div className="flex flex-row">
        {
          revistasLinks && revistasLinks.map(ele=>(
            <ImageCuadroLink backgroundImage={(ele.image! as Media).url!} link={ele.url} text="Ver Revista"/>
          ))
        }
            </div>
        </div>
    )
}