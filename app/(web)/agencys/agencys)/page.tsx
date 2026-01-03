import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { cache, Suspense } from "react"
import { AgencyHero } from "~/app/(web)/agencys/(agencys)/agency-hero"
import { StructuredData } from "~/components/web/structured-data"
import { AgencyListSkeleton } from "~/components/web/agencys/agency-list"
import { AgencyQuery } from "~/components/web/agencys/agency-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateCollectionPage } from "~/lib/structured-data"

// I18n page namespace
const namespace = "pages.agencys"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/agencys"
  const title = t(`${namespace}.title`)
  const description = t(`${namespace}.description`, { siteName: siteConfig.name })

  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title: t("navigation.agencys") }],
    structuredData: [generateCollectionPage(url, title, description)],
  })
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  return getPageMetadata({ url, metadata })
}

export default async function (props: PageProps<"/agencys">) {
  const { metadata, breadcrumbs, structuredData } = await getData()

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <AgencyHero />

      <Suspense fallback={<AgencyListSkeleton />}>
        <AgencyQuery searchParams={props.searchParams} options={{ enableFilters: true }} />
      </Suspense>

      <StructuredData data={structuredData} />
    </>
  )
}
