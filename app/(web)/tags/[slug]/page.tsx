import { capitalCase } from "change-case"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getI18nMetadata, getPageMetadata } from "~/lib/metadata"
import {
  createGraph,
  generateBreadcrumbs,
  generateCollectionPage,
  generateWebPage,
  getOrganization,
  getWebSite,
} from "~/lib/structured-data"
import { findTag, findTagSlugs } from "~/server/web/tags/queries"

export const dynamicParams = false

type Props = PageProps<"/tags/[slug]">

const getPageData = cache(async ({ params }: Props) => {
  const { slug } = await params
  const tag = await findTag({ where: { slug } })

  if (!tag) {
    notFound()
  }

  const url = `/tags/${tag.slug}`

  const metadata = await getI18nMetadata("pages.tags", t => ({
    title: t("meta.title", { name: tag.name }),
    description: t("meta.description", { name: tag.name, siteName: siteConfig.name }),
  }))

  const breadcrumbs = [
    { name: "Tags", url: "/tags" },
    { name: capitalCase(tag.slug), url },
  ]

  const structuredData = createGraph([
    getOrganization(),
    getWebSite(),
    generateBreadcrumbs(breadcrumbs),
    generateCollectionPage(url, metadata.title, metadata.description),
    generateWebPage(url, metadata.title, metadata.description),
  ])

  return { tag, url, metadata, breadcrumbs, structuredData }
})

export const generateStaticParams = async () => {
  const tags = await findTagSlugs({})
  return tags.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  return getPageMetadata(await getPageData(props))
}

export default async function (props: Props) {
  const { tag, metadata, breadcrumbs, structuredData } = await getPageData(props)
  const { title } = metadata

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{title}</IntroTitle>
      </Intro>

      <Suspense fallback={<ToolListingSkeleton />}>
        <ToolQuery
          searchParams={props.searchParams}
          where={{ tags: { some: { slug: tag.slug } } }}
          search={{ placeholder: `Search in "${tag.name}"...` }}
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
