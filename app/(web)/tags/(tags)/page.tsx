import type { Metadata } from "next"
import { Suspense } from "react"
import { TagListSkeleton } from "~/components/web/tags/tag-list"
import { TagQuery } from "~/components/web/tags/tag-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import { getOpenGraphImageUrl } from "~/lib/opengraph"
import {
  createGraph,
  generateBreadcrumbs,
  generateCollectionPage,
  generateWebPage,
  getOrganization,
  getWebSite,
} from "~/lib/structured-data"

const url = "/tags"
const title = "Browse Tags"
const description =
  "Browse all available tags to discover tools by specific features and capabilities."
const ogImageUrl = getOpenGraphImageUrl({ title, description })
const breadcrumbs = [{ name: "Tags", url }]

export const metadata: Metadata = {
  title,
  description,
  alternates: { ...metadataConfig.alternates, canonical: url },
  openGraph: { ...metadataConfig.openGraph, url, images: [{ url: ogImageUrl }] },
}

const getStructuredData = () => {
  return createGraph([
    getOrganization(),
    getWebSite(),
    generateBreadcrumbs(breadcrumbs),
    generateWebPage(url, title, description),
    generateCollectionPage(url, title, description),
  ])
}

export default function (props: PageProps<"/tags">) {
  const structuredData = getStructuredData()

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{title}</IntroTitle>
      </Intro>

      <Suspense fallback={<TagListSkeleton />}>
        <TagQuery searchParams={props.searchParams} options={{ enableFilters: true }} />
      </Suspense>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  )
}
