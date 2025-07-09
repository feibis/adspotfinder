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
  perPage?: number
  page?: number
  siblings?: number
  boundaries?: number
}

export const Pagination = ({
  className,
  total,
  perPage = 1,
  page = 1,
  siblings,
  boundaries,
  ...props
}: PaginationProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const pageCount = Math.ceil(total / perPage)

  const pagination = usePagination({
    total: pageCount,
    page,
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
        href={getPageLink(params, pathname, page - 1)}
        isDisabled={page <= 1}
        prefix={<ArrowLeftIcon />}
        rel="prev"
      >
        Prev
      </PaginationLink>

      <Note className="md:hidden">
        Page {page} of {pageCount}
      </Note>

      <div className="flex items-center flex-wrap gap-3 max-md:hidden">
        <Note as="span">Page:</Note>

        {pagination.range.map((value, index) => (
          <div key={`page-${index}`}>
            {value === "dots" && <span className={navLinkVariants()}>...</span>}

            {typeof value === "number" && (
              <PaginationLink
                href={getPageLink(params, pathname, value)}
                isActive={value === page}
                className="min-w-5 justify-center"
              >
                {value}
              </PaginationLink>
            )}
          </div>
        ))}
      </div>

      <PaginationLink
        href={getPageLink(params, pathname, page + 1)}
        isDisabled={page >= pageCount}
        suffix={<ArrowRightIcon />}
        rel="next"
      >
        Next
      </PaginationLink>
    </nav>
  )
}
