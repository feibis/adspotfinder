"use client"

import { usePagination } from "@mantine/hooks"
import { getPageLink } from "@primoui/utils"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import type { ComponentProps } from "react"
import { Note } from "~/components/common/note"
import { PaginationLink } from "~/components/web/pagination-link"
import { navLinkVariants } from "~/components/web/ui/nav-link"
import { cx } from "~/lib/utils"

export type PaginationProps = ComponentProps<"nav"> & {
  total: number
  pageSize?: number
  currentPage?: number
  siblings?: number
  boundaries?: number
}

export const Pagination = ({
  className,
  total,
  pageSize = 1,
  currentPage = 1,
  siblings,
  boundaries,
  ...props
}: PaginationProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const pageCount = Math.ceil(total / pageSize)

  const pagination = usePagination({
    total: pageCount,
    page: currentPage,
    siblings,
    boundaries,
  })

  if (pagination.range.length <= 1) {
    return null
  }

  return (
    <nav
      className={cx("-mt-px flex w-full items-start justify-between text-sm md:w-auto", className)}
      {...props}
    >
      <PaginationLink
        href={getPageLink(params, pathname, currentPage - 1)}
        isDisabled={currentPage <= 1}
        prefix={<ArrowLeftIcon />}
        rel="prev"
      >
        Prev
      </PaginationLink>

      <Note className="md:hidden">
        Page {currentPage} of {pageCount}
      </Note>

      <div className="flex items-center flex-wrap gap-3 max-md:hidden">
        <Note as="span">Page:</Note>

        {pagination.range.map((page, index) => (
          <div key={`page-${index}`}>
            {page === "dots" && <span className={navLinkVariants()}>...</span>}

            {typeof page === "number" && (
              <PaginationLink
                href={getPageLink(params, pathname, page)}
                isActive={currentPage === page}
                className="min-w-5 justify-center"
              >
                {page}
              </PaginationLink>
            )}
          </div>
        ))}
      </div>

      <PaginationLink
        href={getPageLink(params, pathname, currentPage + 1)}
        isDisabled={currentPage >= pageCount}
        suffix={<ArrowRightIcon />}
        rel="next"
      >
        Next
      </PaginationLink>
    </nav>
  )
}
