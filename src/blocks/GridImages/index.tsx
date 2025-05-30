import { GridImagesBlockType, Media } from "@/cms-types";
import GridComponent from "@/components/GridComponent";

interface Props extends GridImagesBlockType {
}

export async function GridImages(props: Props) {
    const {Image} = props
    return(
        (Image && Image.length >= 3) ?(
        <div>
            <GridComponent images={Image.map(ele=>({
                src: (ele.image as Media).url ,
                id: ele.id!
            }))}/>
        </div>)
        :
        (<div>No se encontraron Images</div>)
    )
}
