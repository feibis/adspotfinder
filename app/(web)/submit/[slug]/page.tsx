import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"
import { ProductListSkeleton } from "~/components/web/products/product-list"
import { ProductQuery } from "~/components/web/products/product-query"
import { Stats } from "~/components/web/stats"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getI18nMetadata, getPageMetadata } from "~/lib/metadata"
import { isToolPublished } from "~/lib/tools"
import { toolOnePayload } from "~/server/web/tools/payloads"
import { db } from "~/services/db"

type Props = PageProps<"/submit/[slug]">

const getPageData = cache(async ({ params }: Props) => {
  const { slug } = await params

  const tool = await db.tool.findFirst({
    where: { slug, isFeatured: false },
    select: toolOnePayload,
  })

  if (!tool) notFound()

  const url = `/submit/${tool.slug}`
  const namespace = isToolPublished(tool) ? "feature" : "expedite"

  const metadata = await getI18nMetadata(`pages.submit.${namespace}`, t => ({
    title: t("meta.title", { name: tool.name }),
    description: t("meta.description", { name: tool.name, siteName: siteConfig.name }),
  }))

  return { tool, url, metadata }
})

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  return getPageMetadata(await getPageData(props))
}

export default async function (props: Props) {
  const { tool, metadata } = await getPageData(props)
  const { title, description } = metadata
  const isPublished = isToolPublished(tool)

  return (
    <>
      <Intro alignment="center">
        <IntroTitle>{title}</IntroTitle>
        <IntroDescription>{description}</IntroDescription>
      </Intro>

      <Suspense fallback={<ProductListSkeleton />}>
        <ProductQuery
          searchParams={props.searchParams}
          checkoutData={{
            successUrl: `/submit/${tool.slug}/success`,
            cancelUrl: `/submit/${tool.slug}`,
            metadata: { tool: tool.slug },
          }}
          productFilter={({ name }) => {
            return name.includes("Listing") && (!isPublished || !name.includes("Expedited"))
          }}
          productMapper={({ name, ...product }) => {
            return { ...product, name: name.replace("Listing", "").trim() }
          }}
          buttonLabel={({ name, metadata }) => {
            if (name.includes("Free")) {
              return "Current Package"
            }

            if (isPublished) {
              return "Upgrade Listing"
            }

            return metadata.label ?? `Choose ${name}`
          }}
        />
      </Suspense>

      <Stats className="my-4" />
    </>
  )
}
