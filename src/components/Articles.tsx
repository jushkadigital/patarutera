import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ArticleData {
  id: number
  slug: string
  title: string
  imageUrl: string
  imageQuery: string
  description: string // Solo para ArticleCardTop
}

interface ArticleTopProps {
  article: ArticleData
}

const ArticleCardTop: React.FC<ArticleTopProps> = ({ article }) => {
  console.log(article.description)
  return (
    <Card className="bg-[#ffffff] rounded-xl shadow-lg overflow-hidden flex flex-col">
      <Link href={`/blog/${article.slug}`} className="block group">
        <div className="relative w-full h-48 sm:h-56">
          <Image
            src={`${article.imageUrl}?query=${encodeURIComponent(article.imageQuery)}`}
            alt={article.imageQuery}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4 sm:p-6 flex-grow flex flex-col">
          <h3 className="text-xl sm:text-2xl font-semibold text-[#2970b7] mb-2 group-hover:text-blue-700 transition-colors">
            {article.title}
          </h3>
          {article.description && <p className="text-sm text-[#000000] leading-relaxed">{article.description}</p>}
        </CardContent>
      </Link>
    </Card>
  )
}

interface ArticleEntryProps {
  article: ArticleData
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
  const textContainerClass = size === "large" ? "md:w-1/2 p-6" : "sm:w-2/3 p-4"
  const flexDirection = imagePosition === "left" ? "flex-col md:flex-row" : "flex-col md:flex-row-reverse"
  const titleSizeClass = size === "large" ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"

  return (
    <div className={`flex ${flexDirection} items-center my-8 ${className}`}>
      <Link
        href={`/blog/${article.slug}`}
        className={`relative block group ${imageSizeClass} ${size === "large" ? "min-h-[300px] md:min-h-[400px]" : "min-h-[200px]"} rounded-xl overflow-hidden`}
      >
        <Image
          src={`${article.imageUrl}?query=${encodeURIComponent(article.imageQuery)}`}
          alt={article.imageQuery}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className={`${textContainerClass} flex flex-col justify-center`}>
        <h4 className={`${titleSizeClass} font-semibold text-[#2970b7] mb-3 sm:mb-4`}>
          <Link href={`/blog/${article.slug}`} className="hover:text-blue-700 transition-colors">
            {article.title}
          </Link>
        </h4>
        <Link href={`/blog/${article.slug}`} className="text-sm text-[#a7a7a7] hover:text-[#d9d9d9] transition-colors">
          Read more
        </Link>
      </div>
    </div>
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
interface GridBlogProps {
  articles: ArticleData[]
}

export function GridBlogComponent({ articles }: GridBlogProps) {
  // Slice the articles for different sections
  const topArticles = articles.slice(0, 3)
  const article4 = articles[3]
  const articles5_6 = articles.slice(4, 6)
  const article7 = articles[6]
  const article8 = articles[7]
  const articles9_10 = articles.slice(8, 10)

  console.log(articles)
  return (
    <div className="min-h-screen  text-[#ffffff] py-8 sm:py-12">
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

          {(articles5_6.length > 0 || article7) && (
            <div className="flex flex-col lg:flex-row lg:space-x-8 my-8">
              {articles5_6.length > 0 && (
                <div className="lg:w-1/2 flex flex-col space-y-8">
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
              {article7 && (
                <div className="lg:w-1/2 mt-8 lg:mt-0">
                  <ArticleEntry
                    article={article7}
                    imagePosition="right"
                    size="large"
                    className="my-0 h-full flex flex-col"
                  />
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
                      imagePosition="left" // Manteniendo consistencia, podría ser 'right' para variar
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
                    imagePosition="left" // Originalmente era 'right', cambiando para que la imagen esté a la izquierda en esta sección
                    size="large"
                    className="my-0 h-full flex flex-col"
                  />
                </div>
              )}
            </div>
          )}
        </section>

        {/* Pagination Section */}
        <Pagination />
      </div>
    </div>
  )
}
