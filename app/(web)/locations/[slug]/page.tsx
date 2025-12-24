import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { cache, Suspense } from "react"
import { StructuredData } from "~/components/web/structured-data"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateCollectionPage } from "~/lib/structured-data"
import { findLocation, findLocationSlugs } from "~/server/web/locations/queries"

export const dynamicParams = false

type Props = PageProps<"/locations/[slug]">

// I18n page namespace
const namespace = "pages.location"

// Get page data
const getData = cache(async ({ params }: Props) => {
  const { slug } = await params
  const location = await findLocation({ where: { slug } })

  if (!location) {
    notFound()
  }

  const t = await getTranslations()
  const url = `/locations/${location.slug}`
  const title = t(`${namespace}.title`, { name: location.name })
  const description = t(`${namespace}.description`, { name: location.name, siteName: siteConfig.name })

  const data = getPageData(url, title, description, {
    breadcrumbs: [
      { url: "/locations", title: t("navigation.locations") },
      { url, title: location.name },
    ],
    structuredData: [generateCollectionPage(url, title, description)],
  })

  return { location, ...data }
})

export const generateStaticParams = async () => {
  const locations = await findLocationSlugs({})
  return locations.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { url, metadata } = await getData(props)
  return getPageMetadata({ url, metadata })
}

export default async function (props: Props) {
  const { location, metadata, breadcrumbs, structuredData } = await getData(props)
  const t = await getTranslations()
  const placeholder = t(`${namespace}.search.placeholder`, { name: location.name.toLowerCase() })

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
      </Intro>

      <Suspense fallback={<ToolListingSkeleton />}>
        <ToolQuery
          searchParams={props.searchParams}
          where={{ locations: { some: { slug: location.slug } } }}
          search={{ placeholder }}
          ad="Tools"
        />
      </Suspense>

      <StructuredData data={structuredData} />
    </>
  )
}
