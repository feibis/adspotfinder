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
import { findAgency, findAgencySlugs } from "~/server/web/agencys/queries"

export const dynamicParams = false

type Props = PageProps<"/agencys/[slug]">

// I18n page namespace
const namespace = "pages.agency"

// Get page data
const getData = cache(async ({ params }: Props) => {
  const { slug } = await params
  const agency = await findAgency({ where: { slug } })

  if (!agency) {
    notFound()
  }

  const t = await getTranslations()
  const url = `/agencys/${agency.slug}`
  const title = t(`${namespace}.title`, { name: agency.name })
  const description = t(`${namespace}.description`, { name: agency.name, siteName: siteConfig.name })

  const data = getPageData(url, title, description, {
    breadcrumbs: [
      { url: "/agencys", title: t("navigation.agencys") },
      { url, title: agency.name },
    ],
    structuredData: [generateCollectionPage(url, title, description)],
  })

  return { agency, ...data }
})

export const generateStaticParams = async () => {
  const agencys = await findAgencySlugs({})
  return agencys.map(({ slug }: { slug: string }) => ({ slug }))
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { url, metadata } = await getData(props)
  return getPageMetadata({ url, metadata })
}

export default async function (props: Props) {
  const { agency, metadata, breadcrumbs, structuredData } = await getData(props)
  const t = await getTranslations()
  const placeholder = t(`${namespace}.search.placeholder`, { name: agency.name.toLowerCase() })

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
      </Intro>

      <Suspense fallback={<ToolListingSkeleton />}>
        <ToolQuery
          searchParams={props.searchParams}
          where={{ categories: { some: { agencys: { some: { slug: agency.slug } } } } }}
          search={{ placeholder }}
          ad="Tools"
        />
      </Suspense>

      <StructuredData data={structuredData} />
    </>
  )
}
