import { Suspense } from "react"
import { AgencysTable } from "~/app/admin/agencys/_components/agencys-table"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { findAgencys } from "~/server/admin/agencys/queries"
import { agencysTableParamsCache } from "~/server/admin/agencys/schema"

export default withAdminPage(async ({ searchParams }: PageProps<"/admin/agencys">) => {
  const search = agencysTableParamsCache.parse(await searchParams)
  const agencysPromise = findAgencys(search)

  return (
    <Suspense fallback={<DataTableSkeleton title="Agencys" />}>
      <AgencysTable agencysPromise={agencysPromise} />
    </Suspense>
  )
})
