import type { Metadata } from "next"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getI18nMetadata, getPageMetadata } from "~/lib/metadata"

const getPageData = async () => {
  const url = "/dashboard"

  const metadata = await getI18nMetadata("pages.dashboard", t => ({
    title: t("meta.title"),
    description: t("meta.description", { siteName: siteConfig.name }),
  }))

  return { url, metadata }
}

export const generateMetadata = async (): Promise<Metadata> => {
  return getPageMetadata(await getPageData())
}

export default async function ({ children }: LayoutProps<"/dashboard">) {
  const { metadata } = await getPageData()
  const { title, description } = metadata

  return (
    <>
      <Intro>
        <IntroTitle>{title}</IntroTitle>
        <IntroDescription>{description}</IntroDescription>
      </Intro>

      <div className="flex flex-col gap-4">{children}</div>
    </>
  )
}
