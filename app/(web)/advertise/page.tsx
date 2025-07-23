import { LoaderIcon } from "lucide-react"
import type { Metadata } from "next"
import { cache, Suspense } from "react"
import { AdvertisePickers } from "~/app/(web)/advertise/pickers"
import { Button } from "~/components/common/button"
import { Wrapper } from "~/components/common/wrapper"
import { ExternalLink } from "~/components/web/external-link"
import { Stats } from "~/components/web/stats"
import { Testimonial } from "~/components/web/testimonial"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getI18nMetadata, getPageMetadata } from "~/lib/metadata"
import {
  createGraph,
  generateBreadcrumbs,
  generateWebPage,
  getOrganization,
  getWebSite,
} from "~/lib/structured-data"

const getPageData = cache(async () => {
  const url = "/advertise"

  const metadata = await getI18nMetadata("pages.advertise", t => ({
    title: t("meta.title"),
    description: t("meta.description", { siteName: siteConfig.name }),
  }))

  const breadcrumbs = [{ name: "Advertise", url }]

  const structuredData = createGraph([
    getOrganization(),
    getWebSite(),
    generateBreadcrumbs(breadcrumbs),
    generateWebPage(url, metadata.title, metadata.description),
  ])

  return { url, metadata, breadcrumbs, structuredData }
})

export const generateMetadata = async (): Promise<Metadata> => {
  return getPageMetadata(await getPageData())
}

export default async function ({ searchParams }: PageProps<"/advertise">) {
  const { metadata, structuredData } = await getPageData()
  const { t, title, description } = metadata

  return (
    <Wrapper gap="xl">
      <Intro alignment="center">
        <IntroTitle>{title}</IntroTitle>
        <IntroDescription>{description}</IntroDescription>
      </Intro>

      <Suspense fallback={<LoaderIcon className="mx-auto size-[1.25em] animate-spin" />}>
        <AdvertisePickers searchParams={searchParams} />
      </Suspense>

      <Stats />

      <Testimonial
        quote="After advertising on this platform, we saw a 38% increase in qualified leads and 2.4x ROI within the first month. The targeted audience was exactly what our business needed. Highly recommended!"
        author={{
          name: "Piotr Kulpinski",
          image: "/authors/piotrkulpinski.webp",
          title: "Founder of Dirstarter",
        }}
      />

      <hr />

      <Intro alignment="center">
        <IntroTitle size="h2" as="h3">
          {t("cta.title")}
        </IntroTitle>

        <IntroDescription className="max-w-lg">{t("cta.description")}</IntroDescription>

        <Button className="mt-4 min-w-40" asChild>
          <ExternalLink href={`mailto:${siteConfig.email}`}>{t("cta.button")}</ExternalLink>
        </Button>
      </Intro>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Wrapper>
  )
}
