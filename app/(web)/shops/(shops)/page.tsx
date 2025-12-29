import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { cache, Suspense } from "react"
import { StructuredData } from "~/components/web/structured-data"
import { ShopListSkeleton } from "~/components/web/shops/shop-list"
import { ShopQuery } from "~/components/web/shops/shop-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateCollectionPage } from "~/lib/structured-data"

// I18n page namespace
const namespace = "pages.shops"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/shops"
  const title = t(`${namespace}.title`)
  const description = t(`${namespace}.description`, { siteName: siteConfig.name })

  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title: t("navigation.shops") }],
    structuredData: [generateCollectionPage(url, title, description)],
  })
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  return getPageMetadata({ url, metadata })
}

export default async function (props: PageProps<"/shops">) {
  const { metadata, breadcrumbs, structuredData } = await getData()

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
      </Intro>

      <Suspense fallback={<ShopListSkeleton />}>
        <ShopQuery searchParams={props.searchParams} options={{ enableFilters: true }} />
      </Suspense>

      <StructuredData data={structuredData} />
    </>
  )
}
