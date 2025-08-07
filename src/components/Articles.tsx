import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Media, Post } from "@/cms-types"
import RichText from "./RichText"


export type CardPostData = Pick<Post, 'id' | 'title'| 'description' | 'featuredImage' |  'slug' >

interface ArticleTopProps {
  article: CardPostData
}

const ArticleCardTop = ({ article }:ArticleTopProps) => {
  return (
    <Card className="bg-[#ffffff] rounded-xl shadow-lg overflow-hidden flex flex-col group hover:shadow-xl transition-shadow duration-300 py-0">
      <Link href={`/blog/${article.slug}`} className="block">
        <div className="relative w-full h-48 sm:h-56 overflow-hidden">
          <Image
            src={(article.featuredImage as Media).url!}
            alt={(article.featuredImage as Media).alt!}
            layout="fill"
            className="group-hover:scale-105 transition-transform duration-300 object-cover"
          />
        </div>
        <CardHeader className="py-2">
          <CardTitle className="text-xl sm:text-2xl font-semibold text-[#2970b7] group-hover:text-blue-700 transition-colors">
            {article.title}
          </CardTitle>
        </CardHeader>
        {article.description && (
          <CardContent className="pt-0">
            <CardDescription className="text-sm text-[#000000] leading-relaxed">
              <RichText data={article.description}/>
            </CardDescription>

      <Link href={`/blog/${article.slug}`} className="block">
            <Button variant='ghost' className="cursor-pointer">Ver mas</Button>
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
  const imageSizeClass = size === "large" ? "w-full md:w-1/2 h-64 md:h-auto" : "w-full sm:w-1/3 h-40 sm:h-auto"
  const textContainerClass = size === "large" ? "md:w-1/2" : "sm:w-2/3"
  const flexDirection = imagePosition === "left" ? "flex-col md:flex-row" : "flex-col md:flex-row-reverse"
  const titleSizeClass = size === "large" ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"

  return (
    <Card className={`bg-transparent border-none shadow-none flex ${flexDirection} items-center my-8 ${className} py-0`}>
      <Link
        href={`/blog/${article.slug}`}
        className={`relative block group ${imageSizeClass} ${size === "large" ? "min-h-[300px] md:min-h-[400px]" : "min-h-[200px]"} rounded-xl overflow-hidden`}
      >
        <Image
          src={(article.featuredImage as Media).url!}
          alt={(article.featuredImage as Media).alt!}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <CardContent className={`${textContainerClass} flex flex-col justify-center p-6`}>
        <CardHeader className="p-0 pb-3 sm:pb-4">
          <CardTitle className={`${titleSizeClass} font-semibold text-[#2970b7] hover:text-blue-700 transition-colors`}>
            <Link href={`/blog/${article.slug}`}>{article.title}</Link>
          </CardTitle>
        </CardHeader>
        <Link href={`/blog/${article.slug}`} className="block">
            <Button variant='ghost' className="cursor-pointer">Ver mas</Button>
      </Link>
      </CardContent>
    </Card>
  )
}

const Pagination: React.FC = () => {
  const pages = [1, 2, 3, 4, 5]
  const currentPage = 1

  return (
    <nav className="flex justify-center items-center space-x-2 sm:space-x-3 my-12">
      {pages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="icon"
          className={`
            ${currentPage === page ? "bg-[#ffffff] text-[#000000] hover:bg-[#efefef]" : "bg-transparent text-[#ffffff] border-[#a7a7a7] hover:bg-[#2970b7] hover:border-[#2970b7] hover:text-white"}
            rounded-md w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base
          `}
        >
          {page}
        </Button>
      ))}
    </nav>
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
  const article5 = articles[4] // Artículo grande izquierda
  const articles6_7 = articles.slice(5, 7) // 2 artículos pequeños derecha
  const article8 = articles[7] // Artículo grande derecha
  const articles9_10 = articles.slice(8, 10) // 2 artículos pequeños izquierda

  return (
    <div className=" py-8 sm:py-12">
      <div className="container mx-auto px-4">
        {/* Top Articles Section */}
        {topArticles.length > 0 && (
          <section className="mb-12 sm:mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {topArticles.map((article) => (
                <ArticleCardTop key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Content Entries Section */}
        <section>
          {article4 && <ArticleEntry article={article4} imagePosition="left" size="large" />}

          {(article5 || articles6_7.length > 0) && (
            <div className="flex flex-col lg:flex-row lg:space-x-8 my-8">
              {article5 && (
                <div className="lg:w-1/2 mt-8 lg:mt-0">
                  <ArticleEntry
                    article={article5}
                    imagePosition="left"
                    size="large"
                    className="my-0 h-full flex flex-col"
                  />
                </div>
              )}
              {articles6_7.length > 0 && (
                <div className="lg:w-1/2 flex flex-col space-y-8">
                  {articles6_7.map((article) => (
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

          {(article8 || articles9_10.length > 0) && (
            <div className="flex flex-col lg:flex-row-reverse lg:space-x-reverse lg:space-x-8 my-8">
              {articles9_10.length > 0 && (
                <div className="lg:w-1/2 flex flex-col space-y-8">
                  {articles9_10.map((article) => (
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
              {article8 && (
                <div className="lg:w-1/2 mt-8 lg:mt-0">
                  <ArticleEntry
                    article={article8}
                    imagePosition="right"
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
