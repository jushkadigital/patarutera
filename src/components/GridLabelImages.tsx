"use client"

import { JSX, useState, type ReactNode } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Grid3X3, LayoutGrid, List, Layers, Square } from "lucide-react"

interface GridItem {
  id: string
  component: JSX.Element
}

interface ComponentGridProps {
  items: GridItem[]
  layout?: "grid" | "masonry" | "overlapping" | "list" | "mosaic"
}

export default function ComponentGrid({ items, layout = "grid" }: ComponentGridProps) {
 // const [layout, setLayout] = useState(defaultLayout)

  // Ensure we have between 3-9 items
  const validItems = items.slice(0, 9)
  if (validItems.length < 3) {
    console.warn("ComponentGrid requires at least 3 items")
  }

  const layoutOptions = [
    { value: "grid", label: "Grid", icon: Grid3X3 },
    { value: "masonry", label: "Masonry", icon: LayoutGrid },
    { value: "overlapping", label: "Overlapping", icon: Layers },
    { value: "list", label: "List", icon: List },
    { value: "mosaic", label: "Mosaic", icon: Square },
  ]

  const renderGridLayout = () => {
    const gridCols = validItems.length <= 4 ? "lg:grid-cols-2" : validItems.length <= 6 ? "lg:grid-cols-3" : "lg:grid-cols-3"

    return (
      <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
        {validItems.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg transition-transform hover:scale-105"
          >
            {item.component}
          </div>
        ))}
      </div>
    )
  }

  const renderMasonryLayout = () => {
    const heights = ["h-64", "h-80", "h-72", "h-96"]

    return (
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {validItems.map((item, index) => (
          <div key={item.id} className="break-inside-avoid">
            <div
              className={`relative ${heights[index % heights.length]} overflow-hidden rounded-lg mb-4 transition-transform hover:scale-105`}
            >
              {item.component}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderOverlappingLayout = () => {
    return (
      <div className="relative w-full h-[500px] md:h-[600px] mx-auto overflow-hidden">
        {validItems.map((item, index) => {
          const positions = [
            { top: "0%", left: "0%", width: "55%", height: "75%", zIndex: 1 },
            { top: "0%", right: "0%", width: "50%", height: "45%", zIndex: 3 },
            { top: "30%", right: "5%", width: "45%", height: "35%", zIndex: 2 },
            { bottom: "0%", right: "0%", width: "60%", height: "60%", zIndex: 4 },
            { top: "20%", left: "40%", width: "35%", height: "40%", zIndex: 5 },
            { bottom: "5%", left: "10%", width: "40%", height: "30%", zIndex: 3 },
            { top: "50%", left: "0%", width: "35%", height: "35%", zIndex: 2 },
            { top: "10%", left: "25%", width: "30%", height: "25%", zIndex: 6 },
            { bottom: "10%", left: "35%", width: "30%", height: "25%", zIndex: 1 },
          ]

          const position = positions[index % positions.length]

          return (
            <div
              key={item.id}
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
              {item.component}
            </div>
          )
        })}
      </div>
    )
  }

  const renderListLayout = () => {
    return (
      <div className="space-y-4">
        {validItems.map((item, index) => (
          <div
            key={item.id}
            className="relative h-32 overflow-hidden rounded-lg transition-transform hover:scale-[1.02]"
          >
            {item.component}
          </div>
        ))}
      </div>
    )
  }

  const renderMosaicLayout = () => {
    if (validItems.length === 3) {
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-2 md:gap-4 h-[400px] md:h-[500px] w-full">
          <div className="relative row-span-2 overflow-hidden rounded-lg transition-transform hover:scale-105">
            {validItems[0].component}
          </div>
          <div className="relative overflow-hidden rounded-lg transition-transform hover:scale-105">
            {validItems[1].component}
          </div>
          <div className="relative overflow-hidden rounded-lg transition-transform hover:scale-105">
            {validItems[2].component}
          </div>
        </div>
      )
    }

    if (validItems.length === 4) {
      return (
        <div className="grid grid-cols-2 gap-2 md:gap-4 h-[400px] md:h-[500px] w-full">
          {validItems.map((item) => (
            <div key={item.id} className="relative overflow-hidden rounded-lg transition-transform hover:scale-105">
              {item.component}
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-4 grid-rows-3 gap-2 md:gap-4 h-[500px] md:h-[600px] w-full">
        <div className="relative col-span-2 row-span-2 overflow-hidden rounded-lg transition-transform hover:scale-105">
          {validItems[0].component}
        </div>
        <div className="relative overflow-hidden rounded-lg transition-transform hover:scale-105">
          {validItems[1].component}
        </div>
        <div className="relative overflow-hidden rounded-lg transition-transform hover:scale-105">
          {validItems[2].component}
        </div>
        <div className="relative overflow-hidden rounded-lg transition-transform hover:scale-105">
          {validItems[3].component}
        </div>
        <div className="relative overflow-hidden rounded-lg transition-transform hover:scale-105">
          {validItems[4].component}
        </div>
        {validItems.slice(5).map((item) => (
          <div key={item.id} className="relative overflow-hidden rounded-lg transition-transform hover:scale-105">
            {item.component}
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
            {validItems.length < 3 && "Minimum 3 components required"}
            {validItems.length > 9 && "Showing first 9 components"}
          </span>
        </div>

        {/*<Select value={layout} onValueChange={(value: any) => setLayout(value)}>
          <SelectTrigger className="w-[180px]">
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

      {/* Component Grid */}
      <div className="w-full">{renderLayout()}</div>
    </div>
  )
}
