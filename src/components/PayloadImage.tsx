import { Media } from "@/cms-types"
import Image, { ImageProps } from "next/image"



interface Props extends ImageProps {
  media: Media
  className?: string
  fill?: boolean
  
}

type SizeKey =keyof NonNullable<Media['sizes']>;

type OverrideImageProps = Omit<ImageProps, "src" | "alt"> & {
  media: Media // el objeto de Payload
  className?: string
  fill?: boolean
  sources?: {
    media: string // ej: "(max-width: 640px)"
    sizeKey: SizeKey
  }[]
  fallbackSize?: SizeKey
}
const isValidImageObject = (obj) => {
  // Retorna true si el objeto y sus propiedades url y width existen
  return obj && obj.url && obj.width;
};
export default function PayloadImage({ media, className,sources = [
    { media: "(max-width: 640px)", sizeKey: "small" },
    { media: "(max-width: 1024px)", sizeKey: "medium" },
    { media: "(min-width: 1025px)", sizeKey: "large" },
  ],
  fallbackSize = "large"
  ,fill, ...props }:OverrideImageProps) {
  if (!media) return null

  const getMaxSizeNotNull = (sizes:NonNullable<Media['sizes']>)=>{
    let lastKey = ''
    for (const key in sizes) {
      if(isValidImageObject(sizes[key])){
        lastKey = key
      }
      else{

      }
    }
    if (lastKey == ''){
      return {
        url: media.url, width: media.width, height: media.height, mimeType: media.mimeType
      }
    }
    return sizes[lastKey]
  }

  const { alt, url, width, height, sizes } = media
  const image = media.sizes?.[fallbackSize]
 const fallback =
  isValidImageObject(image) ? image! : getMaxSizeNotNull(media.sizes!)

  console.log(fallback)

  return (
    <picture>
      {
        sources.map((s) => {
        const size = media.sizes?.[s.sizeKey]
        if (!size?.url) return null
        return (
          <source
            key={s.media}
            srcSet={size.url}
            media={s.media}
            type={size.mimeType || "image/webp"}
          />
        )
      })
      }
{
    fill ? 
    <Image
        {...props}
        src={fallback.url as string || '/placeholder.svg'}
        alt={alt || ""}
        fill
        className={className}
        unoptimized // <- clave: que Vercel solo cachee, no optimice

      />
    :
    <Image
        {...props}
        src={fallback.url as string || '/placeholder.svg'}
        alt={alt || ""}
        width={width!}
        height={height!}
        className={className}
        unoptimized // <- clave: que Vercel solo cachee, no optimice
      />
}
      
    </picture>
  )
}
