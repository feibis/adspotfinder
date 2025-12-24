import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { cache, Suspense } from "react"
import { StructuredData } from "~/components/web/structured-data"
import { LocationListSkeleton } from "~/components/web/locations/location-list"
import { LocationQuery } from "~/components/web/locations/location-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateCollectionPage } from "~/lib/structured-data"

// I18n page namespace
const namespace = "pages.locations"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/locations"
  const title = t(`${namespace}.title`)
  const description = t(`${namespace}.description`, { siteName: siteConfig.name })

  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title: t("navigation.locations") }],
    structuredData: [generateCollectionPage(url, title, description)],
  })
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  return getPageMetadata({ url, metadata })
}

export default async function (props: PageProps<"/locations">) {
  const { metadata, breadcrumbs, structuredData } = await getData()

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
      </Intro>

      <Suspense fallback={<LocationListSkeleton />}>
        <LocationQuery searchParams={props.searchParams} options={{ enableFilters: true }} />
      </Suspense>

      <StructuredData data={structuredData} />
    </>
  )
}
