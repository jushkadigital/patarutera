import { Post, Tour } from "@/cms-types";
import { getImageURL } from "@/utilities/generateMeta";
import { getClientSideURL } from "@/utilities/getURL";


export const TourSchema = (props:Tour)=>{
    return {
        '@context':'https://schema.org',
        '@type': 'Product',
        name: props.meta?.title,
        description: props.meta?.description,
        image: [
            getImageURL(props.meta?.image)
        ],
        'brand':{
            '@type': 'Organization',
            'name': 'Pata Rutera',
            'url': 'https://www.patarutera.pe'
        },
        'offers':{
            "@type": 'Offer',
            "priceCurrency": "PEN",
            "price": props.priceGeneral,
            "availability": "https://schema.org/InStock",
            "url": `${getClientSideURL()}/tours/${props.slug}`
        },
        "additionalType": "https://schema.org/TouristTrip"

    }
}