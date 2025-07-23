import { lcFirst } from "@primoui/utils"
import { noCase } from "change-case"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { getI18nMetadata, getPageMetadata } from "~/lib/metadata"
import {
  createGraph,
  generateBreadcrumbs,
  generateCollectionPage,
  generateWebPage,
  getOrganization,
  getWebSite,
} from "~/lib/structured-data"
import { findCategory, findCategorySlugs } from "~/server/web/categories/queries"

export const dynamicParams = false

type Props = PageProps<"/categories/[slug]">

const getPageData = cache(async ({ params }: Props) => {
  const { slug } = await params
  const category = await findCategory({ where: { slug } })

  if (!category) {
    notFound()
  }

  const url = `/categories/${category.slug}`

  const metadata = await getI18nMetadata("pages.categories", t => {
    const title = category.label || t("meta.title", { name: category.name })
    const description = lcFirst(category.description ?? noCase(title))

    return { title, description: t("meta.description", { description }) }
  })

  const breadcrumbs = [
    { name: "Categories", url: "/categories" },
    { name: category.name, url },
  ]

  const structuredData = createGraph([
    getOrganization(),
    getWebSite(),
    generateBreadcrumbs(breadcrumbs),
    generateCollectionPage(url, metadata.title, metadata.description),
    generateWebPage(url, metadata.title, metadata.description),
  ])

  return { category, url, metadata, breadcrumbs, structuredData }
})

export const generateStaticParams = async () => {
  const categories = await findCategorySlugs({})
  return categories.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  return getPageMetadata(await getPageData(props))
}

export default async function (props: Props) {
  const { category, metadata, breadcrumbs, structuredData } = await getPageData(props)
  const { title, description } = metadata

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
