import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { cache, Suspense } from "react"
import { SubmitProducts } from "~/app/(web)/submit/[slug]/products"
import { PlanSkeleton } from "~/components/web/plan"
import { Stats } from "~/components/web/stats"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"
import { getOpenGraphImageUrl } from "~/lib/opengraph"
import { isToolPublished } from "~/lib/tools"
import { type ToolOne, toolOnePayload } from "~/server/web/tools/payloads"
import { db } from "~/services/db"

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

const getTool = cache(async ({ params }: PageProps) => {
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
  if (isToolPublished(tool)) {
    return {
      title: `Boost ${tool.name}'s Visibility`,
      description: `You can upgrade ${tool.name}'s listing on ${config.site.name} to benefit from a featured badge, a prominent placement, and a do-follow link.`,
    }
  }

  return {
    title: `Choose a plan for ${tool.name}`,
    description: `Maximize ${tool.name}'s impact from day one. Select a package that suits your goals - from free listing to premium features.`,
  }
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const tool = await getTool(props)
  const url = `/submit/${tool.slug}`
  const metadata = getMetadata(tool)

  const ogImageUrl = getOpenGraphImageUrl({
    title: String(metadata.title),
    description: metadata.description,
  })

  return {
    ...metadata,
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url, images: [{ url: ogImageUrl }] },
  }
}

export default async function SubmitPackages(props: PageProps) {
  const tool = await getTool(props)
  const { title, description } = getMetadata(tool)

  return (
    <>
      <Intro alignment="center">
        <IntroTitle>{`${title}`}</IntroTitle>
        <IntroDescription>{description}</IntroDescription>
      </Intro>

      <div className="flex flex-wrap justify-center gap-5">
        <Suspense fallback={[...Array(3)].map((_, index) => <PlanSkeleton key={index} />)}>
          <SubmitProducts tool={tool} searchParams={props.searchParams} />
        </Suspense>
      </div>

      <Stats className="my-4" />
    </>
  )
}
