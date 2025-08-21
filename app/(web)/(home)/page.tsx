import { Suspense } from "react"
import { Hero } from "~/app/(web)/(home)/hero"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"

export default function (props: PageProps<"/">) {
  return (
    <>
      <Hero />

      <Suspense fallback={<ToolListingSkeleton />}>
        <ToolQuery searchParams={props.searchParams} options={{ enableFilters: true }} ad="Tools" />
      </Suspense>
    </>
  )
}
