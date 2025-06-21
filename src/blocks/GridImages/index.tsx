import { GridImagesBlockType, Media } from "@/cms-types";
import GridComponent from "@/components/GridComponent";

interface Props extends GridImagesBlockType {
    context?: {
    nameCollection:string
  }| null
}

export async function GridImages(props: Props) {
    const {Image,typeGrid} = props
    return(
        (Image && Image.length >= 3) ?(
        <div>
            <GridComponent images={Image.map(ele=>({
                src: (ele.image as Media).url ,
                id: ele.id!
            }))} layout={typeGrid}/>
        </div>)
        :
        (<div>No se encontraron Images</div>)
    )
}
