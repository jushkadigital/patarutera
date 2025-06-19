
import { unstable_cache } from 'next/cache'
import { BASEURL } from '@/lib/config'
import { Config } from '@/cms-types'

type Global = keyof Config['globals']
async function getGlobal(slug: Global, depth = 0) {
const response = await fetch(`${BASEURL}/api/globals/${slug}?depth=${depth}`)
  const data = await response.json()
  return data
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = (slug: Global, depth = 0) =>
  unstable_cache(async () => getGlobal(slug, depth), [slug], {
    tags: [`global_${slug}`],
  })
