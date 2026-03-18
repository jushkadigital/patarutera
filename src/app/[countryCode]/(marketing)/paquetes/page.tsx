import { cache, Fragment } from "react";

import type { GridPaquetesBlock, Page } from "@/cms-types";
import { MediaBlock } from "@blocks/MediaBlock";
import { RowBlock } from "@blocks/RowBlock";
import { BannerBlock } from "@/blocks/Banner";
import { BASEURL } from "@/lib2/config";

import { LeftPanelSearchPaquete } from "@/components/leftSearchPanelPaquetes";
import { SharedStateProvider } from "@/hooks/sharedContextDestinos";
import { CarouselDestinos } from "@/blocks/CarouselDestinos";
import { TikTokLinksBlock } from "@/blocks/TikToksLinksBlock";
import { ReconocimientosBlock } from "@/blocks/Reconocimientos";
import { OfertasBlock } from "@/blocks/OfertasBlock";
import { SociosBlock } from "@/blocks/Socios";
import { TextContentBlock } from "@/blocks/TextContent";
import { BeneficiosBlock } from "@/blocks/BeneficiosBlock";
import { EstadisticasBlock } from "@/blocks/Estadisticas";
import { YouTubeLinksBlock } from "@/blocks/YoutubeLinksBlock";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { GridPaquetes } from "@/blocks/GridPaquetes";

const blockComponents = {
  gridPaquetes: GridPaquetes,
  mediaBlock: MediaBlock,
  rowBlock: RowBlock,
  carouselDestination: CarouselDestinos,
  tikTokLinks: TikTokLinksBlock,
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
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
  params: Promise<{ countryCode: string }>;
}

function parseSelectedCategories(
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
  const params = await props.searchParams;

  const { page: pageParam } = params;
  const selectedDestinations = parseSelectedDestinations(params.destination);
  const filterTourName = parseSingleParam(params.filterTourName);
  const selectedCategories = parseSelectedCategories(params.categories);
  const currentPage = Number(pageParam) || 1;
  const queryString = buildQueryString(params);
  const { isEnabled: draft } = await draftMode();

  const page = await queryPageBySlug();
  if (!page) {
    notFound();
  }

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
        {heroPageBlocks!.map(async (block) => {
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
        <div className="flex flex-row mt-10 w-[90%] md:w-[85%] mx-auto">
          <div className="lg:w-1/3">
            <LeftPanelSearchPaquete />
          </div>
          <div className="w-full lg:w-3/4">
            <GridPaquetes
              {...(blocks[0] as GridPaquetesBlock)}
              gridColumns={6}
              rangeSlider={true}
              searchParams={queryString}
              filterTourName={filterTourName}
              page={currentPage}
              selectedDestinations={selectedDestinations}
              selectedCategories={selectedCategories}
              overrideDefaults={true}
              fromPayload={false}
              context={{ nameCollection: "paquetes" }}
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
                          ? "w-full px-[clamp(25px,6.6vw,155px)] lg:px-[clamp(136px,13.33vw,256px)]"
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

const queryPageBySlug = cache(async (): Promise<Page | null> => {
  const { isEnabled: draft } = await draftMode(); // draft is not used here, consider removing if not needed
  const data = await fetch(
    `${BASEURL}/api/globals/pacP?depth=2&draft=${draft}`, // Added depth=2 for potentially richer layout data
  );
  const result = await data.json();
  return result || null;
});
