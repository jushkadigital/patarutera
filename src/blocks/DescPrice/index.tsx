import { Media, DescrPriceBlock as DescrPriceBlockType } from "@/cms-types";
import InfiniteImageCarousel from "@/components/infinity-image-carousel";
import PrecioCardComponent from "@/components/PrecioCard";
import RichText from "@/components/RichText";
import { Subtitle } from "@/components/Subtitle";

interface Props extends DescrPriceBlockType {

}

export async function DescrPriceBlock(props: Props) {
    const { blockTitle, leftColumn, rightColumn } = props
    return (
        <div className="w-full">
            <Subtitle titleGroup={blockTitle} />
            <div className="flex flex-col lg:flex-row w-full justify-around">
                <div className="bg-[#ededed] p-0 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-lg p-3 lg:p-8 shadow-sm">
                            {/* Header */}
                            <h1 className="text-[#2970b7] text-xl lg:text-3xl font-bold mb-6 leading-tight">
                                {leftColumn.tourTitle}
                            </h1>
                            <RichText data={leftColumn.tourDescription} />

                        </div>
                    </div>
                </div>
                <div>
                    <PrecioCardComponent priceTitle={rightColumn.priceTitle!} prevText={rightColumn.prevText!} price={rightColumn.price} nextText={rightColumn.nextText!} paymentForm={rightColumn.paymentForm} />
                </div>


            </div>

        </div>
    )
}