import { Paquete, Tour } from '@/cms-types'
import { BASEURL } from '@/lib/config'
import { getServerSideURL } from '@/utilities/getURL'
import type {MetadataRoute} from 'next'

export const fetchCache = 'force-cache'


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getServerSideURL()
  const [tours, paquetes] = await Promise.all([
    fetch(`${BASEURL}/api/tours?limit=0&depth=2&draft=false&select[featuredImage]=true&select[slug]=true&select[title]=true&select[price]=true&select[Desde]=true&select[difficulty]=true&select[iconDifficulty]=true&select[maxPassengers]=true&select[iconMaxPassengers]=true&select[Person desc]=true&select[miniDescription]=true&select[destinos]=true}`,{next:{ tags: ['tours-sitemap'] }}).then(r => r.json()),
    fetch(`${BASEURL}/api/paquetes?limit=0&depth=2&draft=false&select[featuredImage]=true&select[slug]=true&select[title]=true&select[price]=true&select[Desde]=true&select[difficulty]=true&select[iconDifficulty]=true&select[maxPassengers]=true&select[iconMaxPassengers]=true&select[Person desc]=true&select[miniDescription]=true&select[destinos]=true}`,{next:{ tags: ['paquetes-sitemap'] }}).then(r => r.json()),
  ])

  return [
    ...tours.docs.map((tour: Tour) => ({
      url: `${baseUrl}/tours/${tour.slug}`,
      lastModified: tour.updatedAt,
    })),
    ...paquetes.docs.map((paquete: Paquete) => ({
      url: `${baseUrl}/paquetes/${paquete.slug}`,
      lastModified: paquete.updatedAt,
    })),
  ]
}