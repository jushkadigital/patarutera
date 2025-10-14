
// --- 1. Import your Special Page Components ---
// (Replace with your actual component paths and names)
// import OfertasPageComponent from '@/components/special/OfertasPage';
// import PaquetesEspecialesPageComponent from '@/components/special/PaquetesEspecialesPage';
// import OtroComponenteEspecial from '@/components/special/OtroComponenteEspecial';

import { BillingForm } from "@/components/FormFinalizar";
import { ReservationCard } from "@/components/ReservationCard";
import { BASEURL } from "@/lib/config";
import { notFound } from "next/navigation";
// --- 2. Define the Slug-to-Component Mapping ---
// (This maps slugs to the actual component functions)


// Assume slugsEspeciales is defined here or imported
// const slugsEspeciales = ['ofertas', 'paquetes-especiales'];



type PageParams = {
  slug?: string;
  isSpecialPage?: boolean;
  mapsToComponent?: boolean; // Indicates if a special component should be rendered
  // Add any other params you expect
};

type Args = {
  params: Promise<PageParams>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  // console.log('Maps to Component:', mapsToComponent);
  console.log("GAAA")
  const ee = await searchParamsPromise;
  console.log(ee)
  const amount = Number(ee['amount'] as string).toFixed(2)
  const numberPassengers = ee['numberPassengers']



  const dateBooking = new Date(ee['dateBooking'] as string).toLocaleDateString('es-PE')
  const type = ee['type'] as string
  const slugTarget = ee['slugTarget'] as string


  let page
  if (!slugTarget) {
    notFound();
  }

  if (type == 'tour') {

    page = await queryTourBySlug({ slug: slugTarget });

  } else {

    page = await queryPaqueteBySlug({ slug: slugTarget });

  }

  const { title, meta } = page


  return (
    <div className="flex flex-col md:w-[97%]">
      <BillingForm name={title} date={dateBooking} amount={Number(amount)} numberPassengers={Number(numberPassengers)} type={type} image={meta.image} />
    </div>
  );
}


const queryTourBySlug = async ({ slug }: { slug: string }) => {
  const data = await fetch(`${BASEURL}/api/tours?limit=1&where[slug][equals]=${slug}&depth=2&draft=false`);
  const result = await data.json();
  // console.log(result);
  return result.docs?.[0] || null;
};
const queryPaqueteBySlug = async ({ slug }: { slug: string }) => {
  // Fetch a single tour by slug. Adjust depth as needed for tour data.
  const data = await fetch(`${BASEURL}/api/paquetes?limit=1&where[slug][equals]=${slug}&depth=2&draft=false`);
  const result = await data.json();
  return result.docs?.[0] || null;
};

