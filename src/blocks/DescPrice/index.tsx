import { Media, DescrPriceBlock as DescrPriceBlockType } from "@/cms-types";
import InfiniteImageCarousel from "@/components/infinity-image-carousel";
import PrecioCardComponent from "@/components/PrecioCard";
import RichText from "@/components/RichText";
import { Subtitle } from "@/components/Subtitle";

interface Props extends DescrPriceBlockType {
context?: {
    nameCollection:string
  }| null
}

export async function DescrPriceBlock(props: Props) {
    const { blockTitle, leftColumn, rightColumn, context } = props
    return (
        <div className="w-full">
            <Subtitle titleGroup={blockTitle} />
            <div className="flex flex-col lg:flex-row w-full justify-around">
                <div className=" p-0 lg:p-8 shadow-sm border border-1 rounded-xl">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-lg p-3 lg:p-8 ">
                            {/* Header */}
                            <h1 className="text-[#2970b7] text-xl lg:text-3xl font-bold mb-6 leading-tight">
                                {leftColumn.tourTitle}
                            </h1>
                            <RichText data={leftColumn.tourDescription} />

                        </div>
                    </div>
                </div>
                <div>
                    <PrecioCardComponent priceTitle={rightColumn.priceTitle!} prevText={rightColumn.prevText!} price={rightColumn.price} nextText={rightColumn.nextText!} paymentForm={rightColumn.paymentForm}  origen={context!.nameCollection}/>
                </div>


            </div>

        </div>
    )
}