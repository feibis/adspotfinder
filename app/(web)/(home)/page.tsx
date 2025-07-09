import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { Hero } from "~/app/(web)/(home)/hero"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default function Home(props: PageProps) {
  return (
    <>
      <Hero />

      <Suspense fallback={<ToolListingSkeleton />}>
        <ToolQuery
          searchParams={props.searchParams}
          options={{ enableFilters: true }}
          ad={{ type: "Tools" }}
        />
      </Suspense>
    </>
  )
}
