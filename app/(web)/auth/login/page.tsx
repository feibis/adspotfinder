import { LoaderIcon } from "lucide-react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { Login } from "~/components/web/auth/login"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getI18nMetadata, getPageMetadata } from "~/lib/metadata"

const getPageData = async () => {
  const url = "/auth/login"

  const metadata = await getI18nMetadata("pages.auth", t => ({
    title: t("meta.title"),
    description: t("meta.description", { siteName: siteConfig.name }),
  }))

  return { url, metadata }
}

export const generateMetadata = async (): Promise<Metadata> => {
  return getPageMetadata(await getPageData())
}

export default async function () {
  const { metadata } = await getPageData()
  const { title, description } = metadata

  return (
    <>
      <Intro>
        <IntroTitle size="h3">{title}</IntroTitle>
        <IntroDescription className="md:text-sm">{description}</IntroDescription>
      </Intro>

      <Suspense fallback={<LoaderIcon className="animate-spin mx-auto" />}>
        <Login />
      </Suspense>
    </>
  )
}
