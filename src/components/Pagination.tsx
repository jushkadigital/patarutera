'use client'
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/utilities/ui'
import { useRouter } from 'next/navigation'
import React from 'react'



 const finalType = {
  'tours': 'tours',
  'paquetes': 'paquetes',
  'posts': 'blog'
 }

export const Pagination: React.FC<{
  className?: string
  page: number
  totalPages: number
  searchParams:string
  type: 'tours' | 'paquetes'| 'posts'
}> = (props) => {
  const router = useRouter()


  const { className, page, totalPages, type } = props

  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              isActive={hasPrevPage}
              aria-disabled={!hasPrevPage}
              tabIndex={hasPrevPage ? 0 : -1}
              className={!hasPrevPage ? 'pointer-events-none opacity-50' : ''}
              onClick={() => {
                if (hasPrevPage) {
                  const params = new URLSearchParams(props.searchParams)
                  params.set('page', String(page - 1))
                  router.push(`/${finalType[type]}?${params.toString()}`)
                }
              }}
            />
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink
                aria-disabled={!hasPrevPage}
                tabIndex={hasPrevPage ? 0 : -1}
                className={!hasPrevPage ? 'pointer-events-none opacity-50' : ''}
                onClick={() => {
                  if (hasPrevPage) {
                    const params = new URLSearchParams(props.searchParams)
                    params.set('page', String(page - 1))
                    router.push(`/${finalType[type]}?${params.toString()}`)
                  }
                }}
              >
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink
              aria-current="page"
              tabIndex={-1}
              isActive
              className="pointer-events-none  "
            >
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink
                aria-disabled={!hasNextPage}
                tabIndex={hasNextPage ? 0 : -1}
                className={!hasNextPage ? 'pointer-events-none opacity-50' : ''}
                onClick={() => {
                  if (hasNextPage) {
                    const params = new URLSearchParams(props.searchParams)
                    params.set('page', String(page + 1))
                    router.push(`/${finalType[type]}?${params.toString()}`)
                  }
                }}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              isActive={hasNextPage}
              aria-disabled={!hasNextPage}
              tabIndex={hasNextPage ? 0 : -1}
              className={!hasNextPage ? 'pointer-events-none opacity-50' : ''}
              onClick={() => {
                if (hasNextPage) {
                  const params = new URLSearchParams(props.searchParams)
                  params.set('page', String(page + 1))
                  router.push(`/${finalType[type]}?${params.toString()}`)
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}