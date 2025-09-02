import { Suspense } from "react"
import { Hero } from "~/app/(web)/(home)/hero"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { siteConfig } from "~/config/site"
import {
  createGraph,
  generateBreadcrumbs,
  generateItemList,
  generateWebPage,
  getOrganization,
  getWebSite,
} from "~/lib/structured-data"

const getStructuredData = () => {
  return createGraph([
    getOrganization(),
    getWebSite(),
    generateBreadcrumbs([]),
    generateItemList([]),
    generateWebPage(siteConfig.url, siteConfig.name, siteConfig.description),
  ])
}

export default function (props: PageProps<"/">) {
  const structuredData = getStructuredData()

  return (
    <>
      <Hero />

      <Suspense fallback={<ToolListingSkeleton />}>
        <ToolQuery searchParams={props.searchParams} options={{ enableFilters: true }} ad="Tools" />
      </Suspense>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  )
}
