'use client'
import type React from "react"
import Link from "next/link"
import Image from "@/components/PayloadImage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Media, Post } from "@/cms-types"
import RichText from "./RichText"
import { useMobile } from "@/hooks/useMobile"


export type CardPostData = Pick<Post, 'id' | 'title'| 'description' | 'featuredImage' |  'slug' >

interface ArticleTopProps {
  article: CardPostData
}

const ArticleCardTop = ({ article }:ArticleTopProps) => {
  return (
    <Card className="bg-[#ffffff] rounded-xl shadow-lg overflow-hidden flex flex-col group hover:shadow-xl transition-shadow duration-300 py-0">
      <Link href={`/blog/${article.slug}`} className="block">
        <div className="relative w-full h-80 lg:h-[clamp(0px,18vw,345px)] overflow-hidden">
          <Image
            media={(article.featuredImage as Media)}
            className="group-hover:scale-105 transition-transform duration-300 object-cover"
          />
        </div>
        <CardHeader className="py-2">
          <CardTitle className="text-xl sm:text-2xl lg:text-[clamp(12.24px,1.3vw,25.6px)] font-semibold text-[#2970b7] group-hover:text-blue-700 transition-colors">
            {article.title}
          </CardTitle>
        </CardHeader>
        {article.description && (
          <CardContent className="pt-0">
            <CardDescription className="text-sm text-[#000000] leading-relaxed">
              <RichText data={article.description} className="custom-prose-lg"/>
            </CardDescription>

      <Link href={`/blog/${article.slug}`} className="block">
            <Button variant='ghost' className="cursor-pointer text-[#2970B7]">Ver mas</Button>
      </Link>
          </CardContent>
        )}
      </Link>
    </Card>
  )
}

interface ArticleEntryProps {
  article: CardPostData
  imagePosition?: "left" | "right"
  size?: "large" | "small"
  className?: string
}

const ArticleEntry: React.FC<ArticleEntryProps> = ({
  article,
  imagePosition = "left",
  size = "large",
  className = "",
}) => {
  
  const isMobile = useMobile()

  if (isMobile){
    size = 'large'
  }

  const imageSizeClass = size === "large" ? "w-full md:w-1/2 h-80 lg:h-[clamp(320px,31.33vw,601px)]" : "w-full sm:w-1/3 h-40 lg:h-[clamp(153.6px,15vw,288px)]"
  const textContainerClass = size === "large" ? "w-full md:w-1/2" : "w-full sm:w-2/3"
  const flexDirection = imagePosition === "left" ? "flex-col md:flex-row" : "flex-col md:flex-row-reverse"
  const titleSizeClass = size === "large" ? "text-xl sm:text-2xl lg:text-[clamp(12.24px,1.3vw,25.6px)]" : "text-xl sm:text-xl lg:text-[clamp(10.24px,1vw,19.2px)]"

  return (
    <Card className={`bg-transparent border-none shadow-none flex ${flexDirection} items-center my-8 ${className} py-0`}>
      <Link
        href={`/blog/${article.slug}`}
        className={`relative block group ${imageSizeClass}  rounded-xl overflow-hidden`}
      >
        <Image
          media={(article.featuredImage as Media)}
          className="group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <CardContent className={`${textContainerClass} flex flex-col justify-center p-6`}>
        <CardHeader className="p-0 pb-3 sm:pb-4">
          <CardTitle className={`${titleSizeClass} font-semibold text-[#2970b7] hover:text-blue-700 transition-colors leading-tight  multi-line-truncate multi-line-truncate-2`}>
            <Link href={`/blog/${article.slug}`}>{article.title}</Link>
          </CardTitle>
        </CardHeader>
        <CardDescription className="text-sm text-[#000000] leading-relaxed">
              <RichText data={article.description} className="custom-prose-lg !my-1"/>
            </CardDescription>
        <Link href={`/blog/${article.slug}`} className="block">
            <Button variant='ghost' className="cursor-pointer">Ver mas</Button>
      </Link>
      </CardContent>
    </Card>
  )
}


// Sample data for 10 articles

// Asignar queries de imagen más específicas para los primeros artículos basados en el diseño original
interface PeruTravelBlogPageProps {
  articles: CardPostData[]
}

export function PeruTravelBlogPage({ articles }: PeruTravelBlogPageProps) {
  // Slice the articles for different sections
  const topArticles = articles.slice(0, 3)
  const article4 = articles[3] // Artículo individual grande
  const articles5_6 = articles.slice(4, 6) // 2 artículos pequeños derecha
  const article7 = articles[6] // Artículo grande derecha
  const articles8_9 = articles.slice(7, 9) // 2 artículos pequeños izquierda

  return (
    <div className=" py-8 sm:py-12">
      <div className="container mx-auto px-4">
        {/* Top Articles Section */}
        {topArticles.length > 0 && (
          <section className="mb-12 sm:mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 lg:gap-8">
              {topArticles.map((article) => (
                <ArticleCardTop key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Content Entries Section */}
        <section>

          {(article4 || articles5_6.length > 0) && (
            <div className="flex flex-col lg:flex-row lg:space-x-8 my-8">
              {article4 && (
                <div className="lg:w-1/2 mt-8 lg:mt-0">
                  <ArticleEntry
                    article={article4}
                    imagePosition="left"
                    size="large"
                    className="my-0 h-full flex flex-col"
                  />
                </div>
              )}
              {articles5_6.length > 0 && (
                <div className="lg:w-1/2 flex flex-col space-y-8 mt-8">
                  {articles5_6.map((article) => (
                    <ArticleEntry
                      key={article.id}
                      article={article}
                      imagePosition="left"
                      size="small"
                      className="my-0"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {(article7 || articles8_9.length > 0) && (
            <div className="flex flex-col lg:flex-row lg:space-x-reverse lg:space-x-8 my-8">
              {articles8_9.length > 0 && (
                <div className="lg:w-1/2 flex flex-col space-y-8">
                  {articles8_9.map((article) => (
                    <ArticleEntry
                      key={article.id}
                      article={article}
                      imagePosition="left"
                      size="small"
                      className="my-0"
                    />
                  ))}
                </div>
              )}
              {article7 && (
                <div className="lg:w-1/2 mt-8 lg:mt-0">
                  <ArticleEntry
                    article={article7}
                    imagePosition="left"
                    size="large"
                    className="my-0 h-full flex flex-col"
                  />
                </div>
              )}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
