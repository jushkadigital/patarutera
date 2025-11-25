import { Post, Tour, Page, Paquete } from "@/cms-types";
import { getImageURL } from "@/utilities/generateMeta";
import { getClientSideURL } from "@/utilities/getURL";
import Script from 'next/script';


export const TourSchema = (props: Tour) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: props.meta?.title,
    description: props.meta?.description,
    image: [
      getImageURL(props.meta?.image)
    ],
    'brand': {
      '@type': 'Organization',
      'name': 'Pata Rutera',
      'url': 'https://www.patarutera.pe'
    },
    'offers': {
      "@type": 'Offer',
      "priceCurrency": "PEN",
      "price": props.priceGeneral,
      "availability": "https://schema.org/InStock",
      "url": `${getClientSideURL()}/tours/${props.slug}`
    },
    "additionalType": "https://schema.org/TouristTrip"

  }
}

interface ETour extends Tour {
  type: string
}
interface EPaquete extends Paquete {
  type: string
}

interface Props {
  page: (ETour | EPaquete)[]
}
export const HomeToursSchema = ({ page }: Props) => {

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Mejores Tours de Agencia X",
    "itemListElement": page.map((pag, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": pag.meta?.title,
        "url": `https://patarutera.pe/${pag.type == "tour" ? "tours" : "paquete"}/${pag.slug}`,
        "image": getImageURL(pag.meta?.image),
        "offers": {
          "@type": "Offer",
          "price": pag.priceGeneral,
          "priceCurrency": "USD"
        }
      }
    }))
  };

  return (
    <Script type={'application/ld+json'} strategy={'lazyOnload'}>
      {JSON.stringify(jsonLd)}
    </Script>
  );
}
