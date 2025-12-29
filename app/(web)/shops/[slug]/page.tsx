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
import { findShop, findShopSlugs } from "~/server/web/shops/queries"

export const dynamicParams = false

type Props = PageProps<"/shops/[slug]">

// I18n page namespace
const namespace = "pages.shop"

// Get page data
const getData = cache(async ({ params }: Props) => {
  const { slug } = await params
  const shop = await findShop({ where: { slug } })

  if (!shop) {
    notFound()
  }

  const t = await getTranslations()
  const url = `/shops/${shop.slug}`
  const title = t(`${namespace}.title`, { name: shop.name })
  const description = t(`${namespace}.description`, { name: shop.name, siteName: siteConfig.name })

  const data = getPageData(url, title, description, {
    breadcrumbs: [
      { url: "/shops", title: t("navigation.shops") },
      { url, title: shop.name },
    ],
    structuredData: [generateCollectionPage(url, title, description)],
  })

  return { shop, ...data }
})

export const generateStaticParams = async () => {
  const shops = await findShopSlugs({})
  return shops.map(({ slug }: { slug: string }) => ({ slug }))
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { url, metadata } = await getData(props)
  return getPageMetadata({ url, metadata })
}

export default async function (props: Props) {
  const { shop, metadata, breadcrumbs, structuredData } = await getData(props)
  const t = await getTranslations()
  const placeholder = t(`${namespace}.search.placeholder`, { name: shop.name.toLowerCase() })

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
      </Intro>

      <Suspense fallback={<ToolListingSkeleton />}>
        <ToolQuery
          searchParams={props.searchParams}
          where={{ shops: { some: { slug: shop.slug } } }}
          search={{ placeholder }}
          ad="Tools"
        />
      </Suspense>

      <StructuredData data={structuredData} />
    </>
  )
}
