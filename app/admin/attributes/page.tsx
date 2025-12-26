import { Suspense } from "react"
import { AttributesTable } from "~/app/admin/attributes/_components/attributes-table"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { findAttributes } from "~/server/admin/attributes/queries"
import { attributesTableParamsCache } from "~/server/admin/attributes/schema"

export default withAdminPage(async ({ searchParams }: PageProps<"/admin/attributes">) => {
  const search = attributesTableParamsCache.parse(await searchParams)
  const attributesPromise = findAttributes(search)

  return (
    <Suspense fallback={<DataTableSkeleton title="Attributes" />}>
      <AttributesTable attributesPromise={attributesPromise} />
    </Suspense>
  )
})

