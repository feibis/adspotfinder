import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"
import { ProductListSkeleton } from "~/components/web/products/product-list"
import { ProductQuery } from "~/components/web/products/product-query"
import { Stats } from "~/components/web/stats"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import { siteConfig } from "~/config/site"
import { getOpenGraphImageUrl } from "~/lib/opengraph"
import { isToolPublished } from "~/lib/tools"
import { type ToolOne, toolOnePayload } from "~/server/web/tools/payloads"
import { db } from "~/services/db"

type Props = PageProps<"/submit/[slug]">

const getTool = cache(async ({ params }: Props) => {
  const { slug } = await params

  const tool = await db.tool.findFirst({
    where: { slug, isFeatured: false },
    select: toolOnePayload,
  })

  if (!tool) {
    notFound()
  }

  return tool
})

const getMetadata = (tool: ToolOne) => {
  let title = `Choose a plan for ${tool.name}`
  let description = `Maximize ${tool.name}'s impact from day one. Select a package that suits your goals - from free listing to premium features.`

  if (isToolPublished(tool)) {
    title = `Boost ${tool.name}'s Visibility`
    description = `You can upgrade ${tool.name}'s listing on ${siteConfig.name} to benefit from a featured badge, a prominent placement, and a do-follow link.`
  }

  return { url: `/submit/${tool.slug}`, title, description }
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const tool = await getTool(props)
  const { url, title, description } = getMetadata(tool)
  const ogImageUrl = getOpenGraphImageUrl({ title, description })

  return {
    title,
    description,
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url, images: [{ url: ogImageUrl }] },
  }
}

export default async function (props: Props) {
  const tool = await getTool(props)
  const { title, description } = getMetadata(tool)
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
