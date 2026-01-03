import { getTranslations } from "next-intl/server"
import { Suspense } from "react"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"

export default async function ToolsPage(props: { searchParams: any }) {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<ToolListingSkeleton />}>
        <ToolQuery
          searchParams={props.searchParams}
          options={{ enableFilters: true }}
          ad="Tools"
        />
      </Suspense>
    </div>
  )
}
