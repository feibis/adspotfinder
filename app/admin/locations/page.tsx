import { Suspense } from "react"
import { LocationsTable } from "~/app/admin/locations/_components/locations-table"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { findLocations } from "~/server/admin/locations/queries"
import { locationsTableParamsCache } from "~/server/admin/locations/schema"

export default withAdminPage(async ({ searchParams }: PageProps<"/admin/locations">) => {
  const search = locationsTableParamsCache.parse(await searchParams)
  const locationsPromise = findLocations(search)

  return (
    <Suspense fallback={<DataTableSkeleton title="Locations" />}>
      <LocationsTable locationsPromise={locationsPromise} />
    </Suspense>
  )
})
