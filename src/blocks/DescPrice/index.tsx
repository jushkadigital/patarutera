import { Media, DescrPriceBlock as DescrPriceBlockType, Footer } from "@/cms-types";
import InfiniteImageCarousel from "@/components/infinity-image-carousel";
import PrecioCardComponent from "@/components/PrecioCard";
import RichText from "@/components/RichText";
import { Subtitle } from "@/components/Subtitle";
import { getCachedGlobal } from "@/utilities/getGlobals";

interface Props extends DescrPriceBlockType {
  context?: {
    nameCollection: string
    title: string
  } | null
}

export async function DescrPriceBlock(props: Props) {
  const { blockTitle, leftColumn, rightColumn, context } = props
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  console.log(footerData)

  let phoneNumber = ""
  if (!footerData.navItems) {

  } else {
    if (!footerData.navItems[0].links) {

    }
    else {

      phoneNumber = footerData.navItems[0].links[0].link!.textInfo!
    }
  }
  return (
    <div className="w-full ">
      <Subtitle titleGroup={blockTitle} />
      <div className="flex flex-col lg:flex-row w-full justify-around">
        <div className="w-full lg:w-[65%] p-0 ">
          <div className="py-3 shadow-sm border-1 rounded-xl lg:w-[95%]">
            <div className="mx-auto w-[90%] lg:w-[95%]">
              <div className="bg-white rounded-lg p-3 lg:p-8 ">
                {/* Header */}
                <h1 className="text-[#2970b7] text-xl lg:text-[clamp(16.3px,1.6vw,30.72px)] font-bold mb-6 leading-tight">
                  {leftColumn.tourTitle}
                </h1>
                <RichText data={leftColumn.tourDescription} />

              </div>
            </div>
          </div>
        </div>
        <div className="w-[60%] mx-auto lg:mx-0 lg:w-[35%] sm:mt-10 lg:mt-0">
          <PrecioCardComponent priceTitle={rightColumn.priceTitle!} prevText={rightColumn.prevText!} price={rightColumn.price!} nextText={rightColumn.nextText!} paymentForm={rightColumn.paymentForm} origen={context!.nameCollection} phoneNumber={phoneNumber} title={context!.title} />
        </div>


      </div>

    </div>
  )
}
