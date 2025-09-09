import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import RichText from "./RichText"

interface Props {
  tabs: any[]
}

export const Faq = ({ tabs }: Props) => {
  return (
    <section className="py-0">
      <div className="container">
        <div className="mx-auto mt-0  space-y-4">
          <Accordion type="single" collapsible>
            {
              tabs.map((ele, idx) =>
                <AccordionItem value={idx.toString()}>
                  <AccordionTrigger className="flex items-center justify-between border-2 border-gray-200 rounded-2xl px-5 py-2">
                    <div className="flex items-center gap-4">
                      <div className={'w-1 h-12 bg-yellow-500 rounded-full'}></div>
                      <h3 className="text-[#2970B7] text-[clamp(0px,3.8vw,20.48px)] sm:text-[clamp(0px,2.3vw,20.48px)] md:text-[clamp(0px,1.8vw,25.48px)] lg:text-[clamp(10.92px,1vw,20.48px)]  mt-0  font-semibold transition-colors duration-300
                      group-hover:text-white  align-top">{ele.title}</h3>
                    </div>

                  </AccordionTrigger>
                  <AccordionContent className="border-2 border-gray-200 rounded-2xl">
                    <RichText data={ele.content} className="" />
                  </AccordionContent>
                </AccordionItem>

              )
            }
          </Accordion>
        </div>
      </div>
    </section>
  )
}
