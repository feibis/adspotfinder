import type { Metadata } from "next"
import { Suspense } from "react"
import { CategoryListSkeleton } from "~/components/web/categories/category-list"
import { CategoryQuery } from "~/components/web/categories/category-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import { getOpenGraphImageUrl } from "~/lib/opengraph"
import {
  createGraph,
  generateBreadcrumbs,
  generateCollectionPage,
  generateWebPage,
} from "~/lib/structured-data"

const url = "/categories"
const title = "Browse Categories"
const description = "Browse all tool categories to find the perfect software for your needs."
const ogImageUrl = getOpenGraphImageUrl({ title, description })
const breadcrumbs = [{ name: "Categories", url }]

const getStructuredData = () => {
  return createGraph([
    generateWebPage(url, title),
    generateBreadcrumbs(breadcrumbs),
    generateCollectionPage(url, title, description),
  ])
}

export const metadata: Metadata = {
  title,
  description,
  alternates: { ...metadataConfig.alternates, canonical: url },
  openGraph: { ...metadataConfig.openGraph, url, images: [{ url: ogImageUrl }] },
}

export default function () {
  const structuredData = getStructuredData()

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{title}</IntroTitle>
      </Intro>

      <Suspense fallback={<CategoryListSkeleton />}>
        <CategoryQuery />
      </Suspense>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  )
}
