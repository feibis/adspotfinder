import { Suspense } from "react"
import { ShopsTable } from "~/app/admin/shops/_components/shops-table"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { findShops } from "~/server/admin/shops/queries"
import { shopsTableParamsCache } from "~/server/admin/shops/schema"

export default withAdminPage(async ({ searchParams }: PageProps<"/admin/shops">) => {
  const search = shopsTableParamsCache.parse(await searchParams)
  const shopsPromise = findShops(search)

  return (
    <Suspense fallback={<DataTableSkeleton title="Shops" />}>
      <ShopsTable shopsPromise={shopsPromise} />
    </Suspense>
  )
})
