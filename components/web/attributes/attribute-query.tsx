import type { Prisma } from "~/.generated/prisma/client"
import type { PaginationProps } from "~/components/web/pagination"
import type { AttributeListProps } from "~/components/web/attributes/attribute-list"
import {
  AttributeListing,
  type AttributeListingProps,
} from "~/components/web/attributes/attribute-listing"
import { findAttributes } from "~/server/web/attributes/queries"

type AttributeQueryProps = Omit<AttributeListingProps, "list" | "pagination"> & {
  where?: Prisma.AttributeWhereInput
  list?: Partial<Omit<AttributeListProps, "attributes">>
  pagination?: Partial<Omit<PaginationProps, "total" | "pageSize">>
}

const AttributeQuery = async ({ where, list, pagination, ...props }: AttributeQueryProps) => {
  const attributes = await findAttributes({ where })

  return (
    <AttributeListing
      list={{ attributes, ...list }}
      pagination={{ total: attributes.length, perPage: attributes.length, page: 1, ...pagination }}
      {...props}
    />
  )
}

export { AttributeQuery, type AttributeQueryProps }

