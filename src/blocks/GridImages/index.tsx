import { GridImagesBlockType, Media } from "@/cms-types";
import GridComponent from "@/components/GridComponent";
import { Subtitle } from "@/components/Subtitle";

interface Props extends GridImagesBlockType {
  context?: {
    nameCollection: string
  } | null
}

export async function GridImages(props: Props) {
  const { Image, typeGrid, blockTitle } = props
  return (
    (Image && Image.length >= 1) ? (
      <div className=" mx-auto py-4 bg bg-white w-[90%]">

        <Subtitle className="" titleGroup={blockTitle} />
        <GridComponent images={Image.map((ele) => ele.image as Media)} layout={typeGrid} />
      </div>)
      :
      (<div>No se encontraron Images</div>)
  )
}
