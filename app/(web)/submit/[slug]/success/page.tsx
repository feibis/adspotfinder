import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { cache } from "react"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getI18nMetadata, getPageMetadata } from "~/lib/metadata"
import { toolOnePayload } from "~/server/web/tools/payloads"
import { db } from "~/services/db"

type Props = PageProps<"/submit/[slug]/success">

const getPageData = cache(async ({ params }: Props) => {
  const { slug } = await params

  const tool = await db.tool.findFirst({
    where: { slug },
    select: toolOnePayload,
  })

  if (!tool) notFound()

  const url = `/submit/${tool.slug}/success`
  const namespace = tool.isFeatured ? "featured" : "success"

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
  const { metadata } = await getPageData(props)
  const { title, description } = metadata

  return (
    <>
      <Intro alignment="center">
        <IntroTitle>{title}</IntroTitle>
        <IntroDescription>{description}</IntroDescription>
      </Intro>

      <Image
        src={"/3d-heart.webp"}
        alt=""
        width={256}
        height={228}
        loading="eager"
        className="max-w-64 w-2/3 h-auto mx-auto"
      />
    </>
  )
}
