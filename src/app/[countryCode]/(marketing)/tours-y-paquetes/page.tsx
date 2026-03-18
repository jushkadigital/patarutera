import { Fragment } from "react";

import { LeftPanelSearch } from "@/components/leftPanelSearch";
import { SharedStateProvider } from "@/hooks/sharedContextDestinos";
import { GridBoth } from "@/blocks/GridBoth";
import { BASEURL } from "@/lib2/config";
import { LeftPanelSearchBoth } from "@/components/LeftPanelSearchBoth";

interface Props {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
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
  const destination = parseSingleParam(params.destination);
  const filterTourName = parseSingleParam(params.filterTourName);
  const selectedCategories = parseSelectedCategories(params.categories);
  const currentPage = Number(pageParam) || 1;
  const queryString = buildQueryString(params);

  const categoriesResponse = await fetch(`${BASEURL}/api/tourCategory`);
  const categoriesData = await categoriesResponse.json();

  const categories = categoriesData.docs;

  return (
    <div>
      <Fragment>
        <div
          className="relative flex h-[50vh] w-full items-center justify-center overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: "url('/gracias.png')" }}
        >
          <div className="absolute inset-0 bg-black/35" />
          <h1 className="relative z-10 px-4 text-center text-4xl font-black uppercase tracking-widest text-white drop-shadow-lg md:text-5xl">
            Busqueda
          </h1>
        </div>
      </Fragment>

      <SharedStateProvider>
        <div className="flex flex-row mt-10 w-[90%] md:w-[85%] mx-auto">
          <div className="lg:w-1/3">
            <LeftPanelSearchBoth categories={categories} />
          </div>
          <div className="w-full lg:w-3/4">
            <GridBoth
              gridColumns={6}
              gridStyle={false}
              rangeSlider={true}
              searchParams={queryString}
              page={currentPage}
              selectedCategories={selectedCategories}
              overrideDefaults={true}
              fromPayload={false}
            />
          </div>
        </div>
      </SharedStateProvider>
    </div>
  );
}
