import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Agencia turistica Peruana enfocada a turistas locales',
  images: [
    {
      url: `${getServerSideURL()}+ '/api/media/file/emptyimage-1200x630.png'`,
    },
  ],
  siteName: 'Pata Rutera',
  title: 'Pata Rutera Peru',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
