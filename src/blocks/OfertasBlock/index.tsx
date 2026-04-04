import type { JSX } from "react";

import type {
  Media,
  Oferta,
  OfertasBlock as OfertasBlockType,
} from "@/cms-types";
import { Subtitle } from "@/components/Subtitle";
import { BASEURL } from "@/lib2/config";
import GridComponent from "@/components/GridLabelImages";
import { OfertaCardComponent } from "@/components/OfertaCard";

interface Props extends OfertasBlockType {
  context?: {
    nameCollection: string;
  } | null;
}

type GridItem = {
  id: string;
  component: JSX.Element;
};

function isMedia(value: unknown): value is Media {
  return typeof value === "object" && value !== null && "url" in value;
}

export async function OfertasBlock(props: Props) {
  const { title, typeGrid } = props;

  let ofertas: Oferta[] = [];
  try {
    const response = await fetch(
      `${BASEURL}/api/ofertas?limit=100&depth=2&draft=false`,
    );
    if (!response.ok) {
      // Consider logging the response status and text for more detailed error info
      // console.error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data && data.docs) {
      ofertas = data.docs;
    }
  } catch (error) {
    console.error("Error fetching ofertas:", error);
    // Podrías también lanzar el error para que un ErrorBoundary superior lo capture si es necesario
    // throw error;
  }

  const ofertaItems = ofertas.reduce<GridItem[]>((acc, ele, idx) => {
    if (!isMedia(ele.imagen)) {
      return acc;
    }

    acc.push({
      id: String(ele.id ?? idx),
      component: (
        <OfertaCardComponent
          isBigSize={idx === 2}
          price={typeof ele.price === "number" ? ele.price : 0}
          perPerson={ele.persona ?? ""}
          type={ele.type ?? ""}
          title={ele.title ?? ""}
          background={ele.imagen}
          slug={ele.slug ?? ""}
        />
      ),
    });

    return acc;
  }, []);

  return (
    <div className=" mx-auto py-0 bg bg-white ">
      <Subtitle className="" titleGroup={title} />
      <div className=" mx-auto">
        <GridComponent items={ofertaItems} layout={typeGrid} />
      </div>
    </div>
  );
}
