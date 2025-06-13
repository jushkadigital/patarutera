"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Grid3X3, LayoutGrid, List, Layers, Square } from "lucide-react"

interface ImageItem {
  src?: string | null
  alt?: string
  id: string
} 

interface ImageGridProps {
  images: ImageItem[]
  layout?: "grid" | "masonry" | "overlapping" | "list" | "mosaic"
}

export default function ImageGrid({ images, layout = "grid" }: ImageGridProps) {
  //const [layout, setLayout] = useState(defaultLayout)

  // Ensure we have between 3-9 images
  const validImages = images.slice(0, 9)
  if (validImages.length < 3) {
    console.warn("ImageGrid requires at least 3 images")
  }

  const layoutOptions = [
    { value: "grid", label: "Grid", icon: Grid3X3 },
    { value: "masonry", label: "Masonry", icon: LayoutGrid },
    { value: "overlapping", label: "Overlapping", icon: Layers },
    { value: "list", label: "List", icon: List },
    { value: "mosaic", label: "Mosaic", icon: Square },
  ]

  const renderGridLayout = () => {
    const gridCols = validImages.length <= 4 ? "lg:grid-cols-2" : validImages.length <= 6 ? "lg:grid-cols-3" : "lg:grid-cols-3"

    return (
      <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
        {validImages.map((image, index) => (
          <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt || 'image'}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
        ))}
      </div>
    )
  }

  const renderMasonryLayout = () => {
    const heights = ["aspect-square", "aspect-[4/5]", "aspect-[3/4]", "aspect-[5/4]"]

    return (
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {validImages.map((image, index) => (
          <div key={image.id} className="break-inside-avoid">
            <div className={`relative ${heights[index % heights.length]} overflow-hidden rounded-lg mb-4`}>
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt || 'image'}
                fill
                className="object-cover transition-transform hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderOverlappingLayout = () => {
    // Layout más compacto que se ajusta al ancho del contenedor padre
    return (
      <div className="relative w-full h-[500px] md:h-[600px] mx-auto overflow-hidden">
        {validImages.map((image, index) => {
          // Posiciones optimizadas para mejor superposición y cobertura
          const positions = [
            // Imagen principal izquierda - más ancha
            { top: "0%", left: "0%", width: "55%", height: "75%", zIndex: 1 },
            // Imagen superior derecha
            { top: "0%", right: "0%", width: "50%", height: "45%", zIndex: 3 },
            // Imagen media derecha - superpuesta
            { top: "30%", right: "5%", width: "45%", height: "35%", zIndex: 2 },
            // Imagen inferior derecha - más grande
            { bottom: "0%", right: "0%", width: "60%", height: "60%", zIndex: 4 },
            // Imagen central superpuesta
            { top: "20%", left: "40%", width: "35%", height: "40%", zIndex: 5 },
            // Imagen inferior izquierda
            { bottom: "5%", left: "10%", width: "40%", height: "30%", zIndex: 3 },
            // Imagen media izquierda
            { top: "50%", left: "0%", width: "35%", height: "35%", zIndex: 2 },
            // Imagen superior central
            { top: "10%", left: "25%", width: "30%", height: "25%", zIndex: 6 },
            // Imagen inferior central
            { bottom: "10%", left: "35%", width: "30%", height: "25%", zIndex: 1 },
          ]

          const position = positions[index % positions.length]

          return (
            <div
              key={image.id}
              className="absolute overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:z-50 hover:shadow-2xl"
              style={{
                top: position.top,
                left: position.left,
                right: position.right,
                bottom: position.bottom,
                width: position.width,
                height: position.height,
                zIndex: position.zIndex,
              }}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt || 'image'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, (max-width: 1200px) 60vw, 50vw"
              />
            </div>
          )
        })}
      </div>
    )
  }

  const renderListLayout = () => {
    return (
      <div className="space-y-4">
        {validImages.map((image, index) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-48 h-48 md:h-32">
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt || 'image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 200px"
                />
              </div>
              <div className="p-4 flex-1">
                <h3 className="font-semibold mb-2">Image {index + 1}</h3>
                <p className="text-sm text-muted-foreground">{image.alt}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const renderMosaicLayout = () => {
    // Dynamic mosaic based on number of images
    if (validImages.length === 3) {
      return (
        <div className="grid lg:grid-cols-2 lg:grid-rows-2 gap-2 md:gap-4 h-[400px] md:h-[500px] w-full">
          <div className="relative row-span-2 overflow-hidden rounded-lg">
            <Image
              src={validImages[0].src || "/placeholder.svg"}
              alt={validImages[0].alt || 'image'}
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={validImages[1].src || "/placeholder.svg"}
              alt={validImages[1].alt || 'image'}
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={validImages[2].src || "/placeholder.svg"}
              alt={validImages[2].alt || 'image'}
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
        </div>
      )
    }

    if (validImages.length === 4) {
      return (
        <div className="grid grid-cols-2 gap-2 md:gap-4 h-[400px] md:h-[500px] w-full">
          {validImages.map((image) => (
            <div key={image.id} className="relative overflow-hidden rounded-lg">
              <Image src={image.src || "/placeholder.svg"} alt={image.alt || 'image'} fill className="object-cover" sizes="50vw" />
            </div>
          ))}
        </div>
      )
    }

    // For 5+ images, create a more complex mosaic
    return (
      <div className="grid grid-cols-4 grid-rows-3 gap-2 md:gap-4 h-[500px] md:h-[600px] w-full">
        <div className="relative col-span-2 row-span-2 overflow-hidden rounded-lg">
          <Image
            src={validImages[0].src || "/placeholder.svg"}
            alt={validImages[0].alt || 'image'}
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
        <div className="relative overflow-hidden rounded-lg">
          <Image
            src={validImages[1].src || "/placeholder.svg"}
            alt={validImages[1].alt || 'image'}
            fill
            className="object-cover"
            sizes="25vw"
          />
        </div>
        <div className="relative overflow-hidden rounded-lg">
          <Image
            src={validImages[2].src || "/placeholder.svg"}
            alt={validImages[2].alt || 'image'}
            fill
            className="object-cover"
            sizes="25vw"
          />
        </div>
        <div className="relative overflow-hidden rounded-lg">
          <Image
            src={validImages[3].src || "/placeholder.svg"}
            alt={validImages[3].alt || 'image'}
            fill
            className="object-cover"
            sizes="25vw"
          />
        </div>
        <div className="relative overflow-hidden rounded-lg">
          <Image
            src={validImages[4].src || "/placeholder.svg"}
            alt={validImages[4].alt || 'image'}
            fill
            className="object-cover"
            sizes="25vw"
          />
        </div>
        {validImages.slice(5).map((image, index) => (
          <div key={image.id} className="relative overflow-hidden rounded-lg">
            <Image src={image.src || "/placeholder.svg"} alt={image.alt || 'image'} fill className="object-cover" sizes="25vw" />
          </div>
        ))}
      </div>
    )
  }

  const renderLayout = () => {
    switch (layout) {
      case "masonry":
        return renderMasonryLayout()
      case "overlapping":
        return renderOverlappingLayout()
      case "list":
        return renderListLayout()
      case "mosaic":
        return renderMosaicLayout()
      default:
        return renderGridLayout()
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {validImages.length < 3 && "Minimum 3 images required"}
            {validImages.length > 9 && "Showing first 9 images"}
          </span>
        </div>

        {/*<Select value={layout} onValueChange={(value: any) => setLayout(value)}>
          <SelectTrigger className="">
            <SelectValue placeholder="Select layout" />
          </SelectTrigger>
          <SelectContent>
            {layoutOptions.map((option) => {
              const Icon = option.icon
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>*/}
      </div>

      {/* Image Grid */}
      <div className="w-full">{renderLayout()}</div>
    </div>
  )
}
