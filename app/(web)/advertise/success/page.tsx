import { tryCatch } from "@primoui/utils"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createLoader, parseAsString } from "nuqs/server"
import { AdDetailsForm } from "~/app/(web)/advertise/success/form"
import { AdCard } from "~/components/web/ads/ad-card"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { metadataConfig } from "~/config/metadata"
import { getOpenGraphImageUrl } from "~/lib/opengraph"
import { cx } from "~/lib/utils"
import { adOnePayload } from "~/server/web/ads/payloads"
import { db } from "~/services/db"
import { stripe } from "~/services/stripe"

const url = "/advertise/success"
const title = "Thank you for your payment!"
const description = "Please complete your advertisement setup by providing your company details."
const ogImageUrl = getOpenGraphImageUrl({ title, description })

export const metadata: Metadata = {
  title,
  description,
  alternates: { ...metadataConfig.alternates, canonical: url },
  openGraph: { ...metadataConfig.openGraph, url, images: [{ url: ogImageUrl }] },
}

export default async function ({ searchParams }: PageProps<"/advertise/success">) {
  const searchParamsLoader = createLoader({ sessionId: parseAsString.withDefault("") })
  const { sessionId } = await searchParamsLoader(searchParams)
  const { data, error } = await tryCatch(stripe.checkout.sessions.retrieve(sessionId))

  if (error || data.status !== "complete") {
    return notFound()
  }

  const existingAd = await db.ad.findFirst({
    where: { sessionId: data.id },
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
          <AdDetailsForm sessionId={data.id} ad={existingAd} className="w-full max-w-xl mx-auto" />
        </Section.Content>

        {existingAd && (
          <Section.Sidebar>
            <AdCard overrideAd={existingAd} />
          </Section.Sidebar>
        )}
      </Section>
    </>
  )
}
