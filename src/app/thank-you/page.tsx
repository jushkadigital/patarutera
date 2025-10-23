import { ContextSvg } from "@/blocks/ContextSvg";
import { BASEURL } from "@/lib/config";
import Image from "next/image";


interface Props {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function Page(props: Props) {

  return (
    <div className="relative h-[100vh]">
      <Image src={'/gracias.png'} fill alt='bg-mercator' className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#2970B7]/80 via-blue-900/80 to-[#123251]/90 " />
      <div className="absolute inset-0 w-full h-full text-white">
        <div className="flex flex-col justify-center items-center h-full w-full">
          <div className="h-20 text-7xl font-black"> !GRACIAS!</div>
          <div className="text-center">
            La operacion fue exitosa y estamos listos para llevarte <br />
            a vivir una gran aventura con <strong> Pata Rutera</strong>
          </div>
        </div>
        <div className="h-4 w-full grid grid-cols-4 relative">
          <div className="bg-blue-600"></div>
          <div className="bg-[#3eae64]"></div>
          <div className="bg-yellow-500"></div>
          <div className="bg-purple-600"></div>
        </div>
      </div>

    </div>

  )
}
