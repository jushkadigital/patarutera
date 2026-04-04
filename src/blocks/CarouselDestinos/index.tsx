import type { CarouselDestinationBlock, Destination, Media } from "@/cms-types";
import CarouselDestinosComponent from "@/components/Carousel2Destinos";
import { BASEURL } from "@/lib2/config";
type Props = CarouselDestinationBlock;

type ItemDestination = {
  title: string;
  button: string;
  src: Media;
  bgImage: Media;
};

function isMedia(value: unknown): value is Media {
  return typeof value === "object" && value !== null && "url" in value;
}

export async function CarouselDestinos(props: Props) {
  const titleObj = props.title;

  let docs: Destination[] = [];

  try {
    const response = await fetch(
      `${BASEURL}/api/destinations?limit=100&depth=1&sort=createdAt`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    docs = Array.isArray(data?.docs) ? (data.docs as Destination[]) : [];
  } catch (error) {
    console.error("Error fetching destinations:", error);
  }

  const dataMap: ItemDestination[] = docs.reduce<ItemDestination[]>(
    (acc, doc) => {
      const src = isMedia(doc.imageDestination) ? doc.imageDestination : null;
      const bgImage = isMedia(doc.backgroundDestination)
        ? doc.backgroundDestination
        : null;

      if (!src || !bgImage || !doc.name) {
        return acc;
      }

      acc.push({
        title: doc.name,
        button: "Ver Destino",
        src,
        bgImage,
      });

      return acc;
    },
    [],
  );

  if (!dataMap.length) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden ">
      <CarouselDestinosComponent slides={[...dataMap]} titleObj={titleObj} />
    </div>
  );
}
