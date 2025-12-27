import { Suspense } from "react"
import { PricingsTable } from "~/app/admin/pricings/_components/pricings-table"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { findPricings } from "~/server/admin/pricings/queries"
import { pricingsTableParamsCache } from "~/server/admin/pricings/schema"

export default withAdminPage(async ({ searchParams }: PageProps<"/admin/pricings">) => {
  const search = pricingsTableParamsCache.parse(await searchParams)
  const pricingsPromise = findPricings(search)

  return (
    <Suspense fallback={<DataTableSkeleton title="Pricings" />}>
      <PricingsTable pricingsPromise={pricingsPromise} />
    </Suspense>
  )
})

