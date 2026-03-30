import { Post, Tour, Page, Paquete, Destination } from "@/cms-types";
import { getImageURL } from "@/utilities/generateMeta";
import { getClientSideURL } from "@/utilities/getURL";
import Script from "next/script";

export const TourSchema = (props: Tour) => {
  return {
    "@context": "https://schema.org",
    "@type": ["Product", "TouristTrip"],
    name: props.meta?.title,
    description: props.meta?.description,
    image: [getImageURL(props.meta?.image)],
    brand: {
      "@type": "Organization",
      name: "Pata Rutera",
      url: "https://patarutera.pe",
    },
    offers: props.priceGeneral
      ? {
        "@type": "Offer",
        priceCurrency: "PEN",
        price: Number(props.priceGeneral) || undefined,
        availability: "https://schema.org/InStock",
        url: `${getClientSideURL()}/pe/tours/${props.slug}`,
      } : undefined,
    additionalType: "https://schema.org/TouristTrip",
    location: {
      "@type": "Place",
      name: `${(props.destinos as Destination).name}, Perú`
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "120"
    }
  };
};

interface ETour extends Tour {
  type: string;
}
interface EPaquete extends Paquete {
  type: string;
}

export const PaqueteSchema = (props: Paquete) => {
  return {
    "@context": "https://schema.org",
    "@type": ["Product", "TouristTrip"],
    name: props.meta?.title,
    description: props.meta?.description,
    image: [getImageURL(props.meta?.image)],
    brand: {
      "@type": "Organization",
      name: "Pata Rutera",
      url: "https://www.patarutera.pe",
    },
    offers: props.priceGeneral
      ? {
        "@type": "Offer",
        priceCurrency: "PEN",
        price: Number(props.priceGeneral) || undefined,
        availability: "https://schema.org/InStock",
        url: `${getClientSideURL()}/pe/paquete/${props.slug}`,
      }
      : undefined,
    additionalType: "https://schema.org/TouristTrip",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "120"
    }

  };
};

interface Props {
  page: (ETour | EPaquete)[];
}
export const HomeToursSchema = ({ page }: Props) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Mejores Tours de Agencia X",
    itemListElement: page.map((pag, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": ["Product", "TouristTrip"],
        name: pag.meta?.title,
        url: `https://patarutera.pe/pe/${pag.type == "tour" ? "tours" : "paquete"}/${pag.slug}`,
        image: getImageURL(pag.meta?.image),
        offers: {
          "@type": "Offer",
          price: Number(pag.priceGeneral) || undefined,
          priceCurrency: "PEN",
        },
      },
    })),
  };

  return (
    <Script type={"application/ld+json"} strategy={"lazyOnload"}>
      {JSON.stringify(jsonLd)}
    </Script>
  );
};
