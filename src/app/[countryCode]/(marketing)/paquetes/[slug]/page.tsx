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

// ISR Configuration: Revalidate every hour (3600 seconds)
// Pages will be statically generated at build time and regenerated in the background
export const revalidate = 3600; // 1 hour

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
  const { isEnabled: draft } = await draftMode();
  const resolvedParams = await paramsPromise;
  const { slug, countryCode } = resolvedParams;

  if (!slug) {
    notFound();
  }

  const paquete = await queryPaqueteBySlug({ slug: slug });

  if (!paquete) {
    notFound();
  }
  const { product } = await getProductByExternalId(paquete.id + "package", {
    countryCode,
  })

  if (!product) {
    // Maneja el caso de que el ID no exista en Medusa
    console.error("Producto no encontrado en Medusa con ID:", paquete.medusaId);
  }

  console.log("MONO")
  console.log(paquete.id)
  console.log(product);

  const { layout, heroPaquete, title } = paquete; // Assuming paquetes have layout and heroPaquete

  const schema = PaqueteSchema(paquete);

  return (
    <>
      <Script
        id="paquete-schema"
        type="application/ld+json"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="">
        {draft && <LivePreviewListener />}
        <div className="flex flex-col-reverse lg:flex-col">
          <RenderHero heroBlocks={heroPaquete} title={title} />
          <div className="flex flex-col space-y-10 order-none">
            <div className='w-full'><h1 className='text-center text-4xl lg:text-[clamp(16.3px,2.6vw,50.72px)]  text-[#2970b7] font-bold italic'>{title}</h1></div>
            <RenderBlocks blocks={layout} context={{ nameCollection: 'paquete', title: title, medusaId: product! }} />
          </div>
        </div>
      </div>
    </>
  );
}

const queryPaqueteBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode();
  // Fetch a single paquete by slug. Adjust depth as needed for paquete data.
  const data = await fetch(
    `${BASEURL}/api/paquetes?limit=1&where[slug][equals]=${slug}&depth=2&draft=${draft}`,
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
