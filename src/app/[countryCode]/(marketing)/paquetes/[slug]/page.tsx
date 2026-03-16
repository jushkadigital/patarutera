import { RenderBlocks } from "@/blocks/renderBlocks";
import { RenderHero } from "@/blocks/renderPaqueteHero";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { PaqueteSchema } from "@/components/Schema";
import { BASEURL } from "@/lib2/config";
import { generateMetaPage } from "@/utilities/generateMeta";
import { getProductByExternalId, listProducts } from "@/lib/data/products";
import { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import Script from "next/script";
import { cache } from "react";
import { HttpTypes } from "@medusajs/types";

// ISR Configuration: Revalidate every hour (3600 seconds)
// Pages will be statically generated at build time and regenerated in the background
export const revalidate = 3600; // 1 hour
export const dynamic = "force-static";


const MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000";
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

const medusaHeaders = MEDUSA_PUBLISHABLE_KEY
  ? { "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY }
  : undefined;

type StoreRegion = {
  id: string;
  currency_code: string;
  countries?: Array<{ iso_2?: string | null }>;
};


export async function generateStaticParams() {
  const paquetesRequest = await fetch(
    `${BASEURL}/api/paquetes?depth=0&limit=1000&draft=false&select[slug]=true`,
  ); // Fetch paquete slugs
  const paquetes = await paquetesRequest.json();

  const params = paquetes.docs
    ?.filter((doc: { slug?: string }) => doc.slug) // Ensure slug exists
    .map(({ slug }: { slug: string }) => ({ slug }));

  return params || [];
}

type PaquetePageParams = {
  slug?: string;
  countryCode?: string;
  // Add any other params specific to paquetes if needed
};


type Args = {
  params: Promise<PaquetePageParams>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PaquetePage({ params: paramsPromise }: Args) {
  const resolvedParams = await paramsPromise;
  const { slug, countryCode } = resolvedParams;

  if (!slug) {
    notFound();
  }

  const paquete = await queryPaqueteBySlug({ slug: slug });

  if (!paquete) {
    notFound();
  }
  const product = await queryProductByExternalId({ externalId: paquete.id + "package", countryCode })

  if (!product) {

    notFound();
    // Maneja el caso de que el ID no exista en Medusa
  }


  const { layout, heroPaquete, title, form } = paquete; // Assuming paquetes have layout and heroPaquete

  const schema = PaqueteSchema(paquete);

  return (
    <>
      <Script
        id="tour-schema"
        type={"application/ld+json"}
        strategy={"lazyOnload"}
      >
        {JSON.stringify(schema)}
      </Script>
      <div className="">
        <div className="flex flex-col-reverse lg:flex-col">
          <RenderHero heroBlocks={heroPaquete} title={title} />
          <div className="flex flex-col space-y-10 order-none">
            <div className='w-full'><h1 className='text-center text-4xl lg:text-[clamp(16.3px,2.6vw,50.72px)]  text-[#2970b7] font-bold italic'>{title}</h1></div>
            <RenderBlocks blocks={layout} context={{ nameCollection: 'paquete', title: title, medusaId: product, formId: form?.id ?? null }} />
          </div>
        </div>
      </div>
    </>
  );
}

const queryRegionByCountryCode = cache(
  async (countryCode?: string): Promise<StoreRegion | null> => {
    if (!countryCode) {
      return null;
    }

    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/regions`, {
      headers: medusaHeaders,
      next: {
        revalidate: 3600,
        tags: ["regions"],
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      return null;
    }

    const { regions } = (await response.json()) as { regions?: StoreRegion[] };
    const normalizedCountryCode = countryCode.toLowerCase();

    return (
      regions?.find((region) =>
        region.countries?.some(
          (country) => country?.iso_2 === normalizedCountryCode,
        ),
      ) ?? null
    );
  },
);

const queryProductByExternalId = cache(
  async ({
    externalId,
    countryCode,
  }: {
    externalId: string;
    countryCode?: string;
  }): Promise<HttpTypes.StoreProduct | null> => {
    const region = await queryRegionByCountryCode(countryCode);

    if (!region) {
      return null;
    }

    const query = new URLSearchParams({
      region_id: region.id,
      currency_code: region.currency_code,
    });

    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/store/products/external/${externalId}?${query.toString()}`,
      {
        headers: medusaHeaders,
        next: {
          revalidate: 3600,
          tags: ["products", `product-${externalId}`],
        },
        cache: "force-cache",
      },
    );

    if (!response.ok) {
      return null;
    }

    const { product } = (await response.json()) as {
      product?: HttpTypes.StoreProduct;
    };

    return product ?? null;
  },
);


const queryPaqueteBySlug = cache(async ({ slug }: { slug: string }) => {
  // Fetch a single paquete by slug. Adjust depth as needed for paquete data.
  const data = await fetch(
    `${BASEURL}/api/paquetes?limit=1&where[slug][equals]=${slug}&depth=2&draft=false`,
    {
      next: {
        tags: ["paquetes", `paquete-${slug}`],
        revalidate: 3600, // 1 hour
      },
    },
  );
  const result = await data.json();
  return result.docs?.[0] || null;
});

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  const { slug = "home" } = await paramsPromise;
  const page = await queryPaqueteBySlug({ slug });
  return generateMetaPage({ doc: page });
}
