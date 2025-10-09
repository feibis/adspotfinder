import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { createLoader, parseAsString } from "nuqs/server"
import { cache } from "react"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { NavLink } from "~/components/web/ui/nav-link"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"

const searchParamsLoader = createLoader({
  email: parseAsString.withDefault(""),
})

const getData = cache(async () => {
  const t = await getTranslations("pages.auth.verify")
  const url = "/auth/verify"
  const title = t("meta.title")
  const description = t("meta.description", { siteName: siteConfig.name })

  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
  })
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  return getPageMetadata({ url, metadata })
}

export default async function ({ searchParams }: PageProps<"/auth/verify">) {
  const { email } = await searchParamsLoader(searchParams)
  const { metadata } = await getData()
  const t = await getTranslations("pages.auth.verify")

  return (
    <>
      <Intro>
        <IntroTitle size="h3">{metadata.title}</IntroTitle>
        <IntroDescription className="text-sm!">{t("description", { email })}</IntroDescription>
      </Intro>

      <p className="text-xs text-muted-foreground/75">
        {t.rich("no_email", {
          link: chunks => (
            <NavLink href="/auth/login" className="inline font-medium">
              {chunks}
            </NavLink>
          ),
        })}
      </p>
    </>
  )
}
