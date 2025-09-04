import { capitalCase } from "change-case"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
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
import type { TagOne } from "~/server/web/tags/payloads"
import { findTag, findTagSlugs } from "~/server/web/tags/queries"

type Props = PageProps<"/tags/[slug]">

const getTag = cache(async ({ params }: Props) => {
  const { slug } = await params
  const tag = await findTag({ where: { slug } })

  if (!tag) {
    notFound()
  }

  return tag
})

const getMetadata = (tag: TagOne) => {
  return {
    url: `/tags/${tag.slug}`,
    title: `Tools tagged "${tag.name}"`,
    description: `Explore tools and software tagged with ${tag.name} to find solutions that match your specific needs.`,
  }
}

const getBreadcrumbs = (tag: TagOne) => [
  { name: "Tags", url: "/tags" },
  { name: capitalCase(tag.slug), url: `/tags/${tag.slug}` },
]

const getStructuredData = (tag: TagOne) => {
  const breadcrumbs = getBreadcrumbs(tag)
  const { url, title, description } = getMetadata(tag)

  return createGraph([
    getOrganization(),
    getWebSite(),
    generateBreadcrumbs(breadcrumbs),
    generateCollectionPage(url, title, description),
    generateWebPage(url, title, description),
  ])
}

export const generateStaticParams = async () => {
  const tags = await findTagSlugs({})
  return tags.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const tag = await getTag(props)
  const url = `/tags/${tag.slug}`
  const { title, description } = getMetadata(tag)
  const ogImageUrl = getOpenGraphImageUrl({ title, description })

  return {
    title,
    description,
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url, images: [{ url: ogImageUrl }] },
  }
}

export default async function (props: Props) {
  const tag = await getTag(props)
  const breadcrumbs = getBreadcrumbs(tag)
  const structuredData = getStructuredData(tag)
  const { title } = getMetadata(tag)

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
