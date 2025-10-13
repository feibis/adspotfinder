import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { cache } from "react"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"

// I18n page namespace
const namespace = "pages.dashboard"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/dashboard"
  const title = t(`${namespace}.meta.title`)
  const description = t(`${namespace}.meta.description`, { siteName: siteConfig.name })

  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
  })
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  return getPageMetadata({ url, metadata })
}

export default async function ({ children }: LayoutProps<"/dashboard">) {
  const { metadata } = await getData()

  return (
    <>
      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <div className="flex flex-col gap-4">{children}</div>
    </>
  )
}
