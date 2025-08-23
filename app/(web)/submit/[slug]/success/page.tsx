import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { cache } from "react"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import { siteConfig } from "~/config/site"
import { getOpenGraphImageUrl } from "~/lib/opengraph"
import { type ToolOne, toolOnePayload } from "~/server/web/tools/payloads"
import { db } from "~/services/db"

type Props = PageProps<"/submit/[slug]/success">

const getTool = cache(async ({ params }: Props) => {
  const { slug } = await params

  const tool = await db.tool.findFirst({
    where: { slug },
    select: toolOnePayload,
  })

  if (!tool) {
    notFound()
  }

  return tool
})

const getMetadata = (tool: ToolOne) => {
  if (tool.isFeatured) {
    return {
      title: "Thank you for your payment!",
      description: `We've received your payment. ${tool.name} should be featured on ${siteConfig.name} shortly.`,
    }
  }

  return {
    title: `Thank you for submitting ${tool.name}!`,
    description: `We'll review ${tool.name}'s submission and publish it on ${siteConfig.name} soon.`,
  }
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const tool = await getTool(props)
  const url = `/submit/${tool.slug}/success`
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

export default async function (props: Props) {
  const tool = await getTool(props)
  const { title, description } = getMetadata(tool)

  return (
    <>
      <Intro alignment="center">
        <IntroTitle>{`${title}`}</IntroTitle>
        <IntroDescription>{description}</IntroDescription>
      </Intro>

      <Image
        src={"/3d-heart.webp"}
        alt=""
        width={256}
        height={228}
        className="max-w-64 w-2/3 h-auto mx-auto"
      />
    </>
  )
}
