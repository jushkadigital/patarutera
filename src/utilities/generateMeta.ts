import type { Metadata } from 'next'

import type { Media, Page, Post, Config, Tour, Paquete, TouP, BlogP, PacP } from '../cms-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/api/media/file/emptyimage-1200x630.png'
  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url
    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }
  return url
}

export const generateMetaPage = async (args: {
  doc: Partial<Page> |null
}): Promise<Metadata> => {
  const { doc } = args
const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title
    ? doc?.meta?.title 
    : 'Pata Rutera'

   return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url:  (doc as Partial<Tour>).slug!,
    }),
    title,
  } 
    

  
  

  
  
}
