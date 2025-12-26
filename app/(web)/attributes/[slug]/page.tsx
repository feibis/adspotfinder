import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { cache, Suspense } from "react"
import { StructuredData } from "~/components/web/structured-data"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateCollectionPage } from "~/lib/structured-data"
import { findAttributeBySlug, findAttributeSlugs } from "~/server/web/attributes/queries"

export const dynamicParams = false

type Props = PageProps<"/attributes/[slug]">

// I18n page namespace
const namespace = "pages.attribute"

// Get page data
const getData = cache(async ({ params }: Props) => {
  const { slug } = await params
  const attribute = await findAttributeBySlug(slug)

  if (!attribute) {
    notFound()
  }

  const t = await getTranslations()
  const url = `/attributes/${attribute.slug}`
  const title = t(`${namespace}.title`, { name: attribute.name })
  const description = t(`${namespace}.description`, {
    name: attribute.name,
    siteName: siteConfig.name,
  })

  const data = getPageData(url, title, description, {
    breadcrumbs: [
      { url: "/attributes", title: t("navigation.attributes") },
      { url, title: attribute.name },
    ],
    structuredData: [generateCollectionPage(url, title, description)],
  })

  return { attribute, ...data }
})

export const generateStaticParams = async () => {
  const attributes = await findAttributeSlugs({})
  return attributes.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { url, metadata } = await getData(props)
  return getPageMetadata({ url, metadata })
}

export default async function (props: Props) {
  const { attribute, metadata, breadcrumbs, structuredData } = await getData(props)
  const t = await getTranslations()
  const placeholder = t(`${namespace}.search.placeholder`, { name: attribute.name.toLowerCase() })

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
        {attribute.group && (
          <IntroDescription>
            {t(`${namespace}.group_label`, { group: attribute.group.name })}
          </IntroDescription>
        )}
      </Intro>

      <Suspense fallback={<ToolListingSkeleton />}>
        <ToolQuery
          searchParams={props.searchParams}
          where={{ attributes: { some: { slug: attribute.slug } } }}
          search={{ placeholder }}
          ad="Tools"
        />
      </Suspense>

      <StructuredData data={structuredData} />
    </>
  )
}

