import { tryCatch } from "@primoui/utils"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createLoader, parseAsString } from "nuqs/server"
import { cache } from "react"
import { AdForm } from "~/app/(web)/advertise/success/ad-form"
import { AdCard } from "~/components/web/ads/ad-card"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { siteConfig } from "~/config/site"
import { getI18nMetadata, getPageMetadata } from "~/lib/metadata"
import { cx } from "~/lib/utils"
import { adOnePayload } from "~/server/web/ads/payloads"
import { db } from "~/services/db"
import { stripe } from "~/services/stripe"

type Props = PageProps<"/advertise/success">

const getPageData = cache(async ({ searchParams }: Props) => {
  const url = "/advertise/success"

  const searchParamsLoader = createLoader({ sessionId: parseAsString.withDefault("") })
  const { sessionId } = await searchParamsLoader(searchParams)
  const { data, error } = await tryCatch(stripe.checkout.sessions.retrieve(sessionId))

  if (error || data.status !== "complete") {
    notFound()
  }

  const metadata = await getI18nMetadata("pages.advertise.success", t => ({
    title: t("meta.title"),
    description: t("meta.description", { siteName: siteConfig.name }),
  }))

  return { session: data, url, metadata }
})

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  return getPageMetadata(await getPageData(props))
}

export default async function (props: PageProps<"/advertise/success">) {
  const { session, metadata } = await getPageData(props)
  const { title, description } = metadata

  const existingAd = await db.ad.findFirst({
    where: { sessionId: session.id },
    select: adOnePayload,
  })

  return (
    <>
      <Intro alignment="center">
        <IntroTitle>{title}</IntroTitle>
        <IntroDescription>{description}</IntroDescription>
      </Intro>

      <Section>
        <Section.Content className={cx(!existingAd && "md:col-span-full")}>
          <AdForm sessionId={session.id} ad={existingAd} className="w-full max-w-xl mx-auto" />
        </Section.Content>

        {existingAd && (
          <Section.Sidebar>
            <AdCard type="All" explicitAd={existingAd} />
          </Section.Sidebar>
        )}
      </Section>
    </>
  )
}
