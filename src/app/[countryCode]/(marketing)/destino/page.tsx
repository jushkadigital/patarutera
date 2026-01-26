import { ContextSvg } from "@/blocks/ContextSvg";
import { BASEURL } from "@/lib2/config";
import Image from "next/image";
import { notFound } from "next/navigation";


interface Props {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function Page(props: Props) {

  const response = await fetch(`${BASEURL}/api/destinations?limit=100&depth=1&sort=createdAt`)
  const data = await response.json()
  if (!data) {
    notFound()
  }
  return (
    <div className="relative h-[100vh] md:h-[110vh]">
      <Image src={'/backgroundDestinoPage.png'} fill alt='bg-mercator' />

      <div className="absolute inset-0 w-full h-full flex justify-center">
        <div className="flex justify-center items-center mt-20 2xl:mt-0">

          <ContextSvg data={data.docs} />
        </div>
      </div>
    </div>
  )
}
