import { cache, Fragment } from "react";

import type {
  GridPaquetesBlock,
  GridToursBlock,
  Media,
  Page,
} from "@/cms-types";
import { MediaBlock } from "@blocks/MediaBlock";
import { GridTours } from "@blocks/GridTours";
import { RowBlock } from "@blocks/RowBlock";
import { BannerBlock } from "@/blocks/Banner";
import { BASEURL } from "@/lib2/config";
import { RenderHero } from "@/blocks/renderHeros";

import { LeftPanelSearch } from "@/components/leftPanelSearch";
import { SharedStateProvider } from "@/hooks/sharedContextDestinos";
import { CarouselDestinos } from "@/blocks/CarouselDestinos";
import { TikTokLinksBlock } from "@/blocks/TikToksLinksBlock";
import { ReconocimientosBlock } from "@/blocks/Reconocimientos";
import { OfertasBlock } from "@/blocks/OfertasBlock";
import { SociosBlock } from "@/blocks/Socios";
import { TextContentBlock } from "@/blocks/TextContent";
import { BeneficiosBlock } from "@/blocks/BeneficiosBlock";
import { EstadisticasBlock } from "@/blocks/Estadisticas";
import { DescrPriceBlock } from "@/blocks/DescPrice";
import { YouTubeLinksBlock } from "@/blocks/YoutubeLinksBlock";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { LeftPanelSearchPaquete } from "@/components/leftSearchPanelPaquetes";
import { GridPaquetes } from "@/blocks/GridPaquetes";

const blockComponents = {
  gridTours: GridTours,
  mediaBlock: MediaBlock,
  rowBlock: RowBlock,
  carouselDestination: CarouselDestinos,
  tikTokLinks: TikTokLinksBlock,
  postRelationTour: null,
  reconocimientos: ReconocimientosBlock,
  ofertas: OfertasBlock,
  socios: SociosBlock,
  textContent: TextContentBlock,
  beneficios: BeneficiosBlock,
  estadisticas: EstadisticasBlock,
  gridImages: null,
  youTubeLinks: YouTubeLinksBlock,
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ pageNumber: string }>;
}

function parseSelectedDestinations(
  value: string | string[] | undefined,
): string[] {
  if (!value) {
    return [];
  }

  const values = Array.isArray(value) ? value : [value];

  return values
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSingleParam(
  value: string | string[] | undefined,
): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value[0];
  }

  return undefined;
}

function buildQueryString(
  params: Record<string, string | string[] | undefined>,
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "string") {
      searchParams.set(key, value);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        searchParams.append(key, item);
      });
    }
  });

  return searchParams.toString();
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const selectedDestinations = parseSelectedDestinations(
    searchParams.destination,
  );
  const filterTourName = parseSingleParam(searchParams.filterTourName);
  const { pageNumber } = await props.params;

  const sanitizedPageNumber = Number(pageNumber);

  const queryString = buildQueryString(searchParams);
  const { isEnabled: draft } = await draftMode();
  let page: any;
  page = await queryPageBySlug();
  if (!page) {
    notFound();
  }

  if (!Number.isInteger(sanitizedPageNumber)) notFound();

  const { layout: blocks, heroPageBlocks } = page;
  const hasBlocksLayout = blocks && Array.isArray(blocks) && blocks.length > 0;
  const hasBlocksHero =
    heroPageBlocks &&
    Array.isArray(heroPageBlocks) &&
    heroPageBlocks.length > 0;

  // Si ambos son falsos, fallback
  if (!hasBlocksLayout && !hasBlocksHero) {
    return <div>No hay contenido para mostrar.</div>;
  }

  // Solo heroBlocks
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  const NoPadding = ["carouselDestination", "reconocimientos", "socios"];

  return (
    <div>
      {draft && <LivePreviewListener />}
      <Fragment>
        {heroPageBlocks!.map(async (block, index) => {
          const { blockType } = block;
          switch (blockType) {
            case "banner": {
              return <BannerBlock {...block} />;
            }
            default:
              return null;
          }
        })}
      </Fragment>

      <SharedStateProvider>
        <div className="flex flex-row mt-10 w-[85%] mx-auto">
          <div className="lg:w-1/3">
            <LeftPanelSearchPaquete />
          </div>
          <div className="w-full lg:w-3/4">
            <GridPaquetes
              {...(blocks[0] as GridPaquetesBlock)}
              selectedDestinations={selectedDestinations}
              filterTourName={filterTourName}
              gridColumns={6}
              gridStyle={false}
              rangeSlider={true}
              searchParams={queryString}
              page={sanitizedPageNumber}
              fromPayload={false}
            />
          </div>
        </div>
      </SharedStateProvider>
      <div className="flex flex-col w-full">
        <Fragment>
          {hasBlocks &&
            blocks.slice(1).map((block, index) => {
              const { blockType } = block;
              if (blockType && blockType in blockComponents) {
                const Block = blockComponents[blockType];

                if (Block) {
                  return (
                    <div
                      className={
                        !NoPadding.includes(blockType)
                          ? "w-full px-36 "
                          : "w-full"
                      }
                      key={index}
                    >
                      <Block {...block} disableInnerContainer />
                    </div>
                  );
                }
              }
              return null;
            })}
        </Fragment>
      </div>
    </div>
  );
}

const queryPageBySlug = cache(async () => {
  const { isEnabled: draft } = await draftMode(); // draft is not used here, consider removing if not needed
  const data = await fetch(
    `${BASEURL}/api/globals/pacP?depth=2&draft=${draft}`,
  ); // Added depth=2 for potentially richer layout data
  const result = await data.json();
  return result || null;
});
export async function generateStaticParams() {
  const req = await fetch(`${BASEURL}/api/paquetes/count`);
  const { totalDocs } = await req.json();

  const totalPages = Math.ceil(totalDocs / 10);

  const pages: { pageNumber: string }[] = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) });
  }

  return pages;
}

// Optional: Metadata for the page
// export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
//   const { slug } = params;
//   const pageData = await getPageDataBySlug(slug);
//   if (!pageData) {
//     return { title: "Page Not Found" };
//   }
//   return {
//     title: `${pageData.title || 'Page'} | Patarutera`,
//     // description: pageData.seoDescription || defaultDescription,
//   };
// }
