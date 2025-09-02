import { lcFirst } from "@primoui/utils"
import { noCase } from "change-case"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
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
import type { CategoryOne } from "~/server/web/categories/payloads"
import { findCategory, findCategorySlugs } from "~/server/web/categories/queries"

type Props = PageProps<"/categories/[slug]">

const getCategory = cache(async ({ params }: Props) => {
  const { slug } = await params
  const category = await findCategory({ where: { slug } })

  if (!category) {
    notFound()
  }

  return category
})

const getMetadata = (category: CategoryOne) => {
  const title = category.label || `${category.name} Tools`

  return {
    url: `/categories/${category.slug}`,
    title,
    description: `A curated collection of the best ${lcFirst(category.description ?? noCase(title))}`,
  }
}

const getBreadcrumbs = (category: CategoryOne) => {
  return [
    { name: "Categories", url: "/categories" },
    { name: category.name, url: `/categories/${category.slug}` },
  ]
}

const getStructuredData = (category: CategoryOne) => {
  const breadcrumbs = getBreadcrumbs(category)
  const { url, title, description } = getMetadata(category)

  return createGraph([
    getOrganization(),
    getWebSite(),
    generateBreadcrumbs(breadcrumbs),
    generateWebPage(url, title, description),
    generateCollectionPage(url, title, description),
  ])
}

export const generateStaticParams = async () => {
  const categories = await findCategorySlugs({})
  return categories.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const category = await getCategory(props)
  const { url, title, description } = getMetadata(category)
  const ogImageUrl = getOpenGraphImageUrl({ title, description })

  return {
    title,
    description,
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url, images: [{ url: ogImageUrl }] },
  }
}

export default async function (props: Props) {
  const category = await getCategory(props)
  const breadcrumbs = getBreadcrumbs(category)
  const structuredData = getStructuredData(category)
  const { title, description } = getMetadata(category)

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{title}</IntroTitle>
        <IntroDescription className="max-w-3xl">{description}</IntroDescription>
      </Intro>

      <Suspense fallback={<ToolListingSkeleton />}>
        <ToolQuery
          searchParams={props.searchParams}
          where={{ categories: { some: { slug: category.slug } } }}
          search={{ placeholder: `Search ${String(title).toLowerCase()}...` }}
          ad="Tools"
        />
      </Suspense>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  )
}
