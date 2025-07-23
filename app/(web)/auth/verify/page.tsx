import type { Metadata } from "next"
import { createLoader, parseAsString } from "nuqs/server"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { NavLink } from "~/components/web/ui/nav-link"
import { siteConfig } from "~/config/site"
import { getI18nMetadata, getPageMetadata } from "~/lib/metadata"

const searchParamsLoader = createLoader({
  email: parseAsString.withDefault(""),
})

const getPageData = async () => {
  const url = "/auth/verify"

  const metadata = await getI18nMetadata("pages.auth.verify", t => ({
    title: t("meta.title"),
    description: t("meta.description", { siteName: siteConfig.name }),
  }))

  return { url, metadata }
}

export const generateMetadata = async (): Promise<Metadata> => {
  return getPageMetadata(await getPageData())
}

export default async function ({ searchParams }: PageProps<"/auth/verify">) {
  const { email } = await searchParamsLoader(searchParams)
  const { metadata } = await getPageData()
  const { t, title } = metadata

  return (
    <>
      <Intro>
        <IntroTitle size="h3">{title}</IntroTitle>
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
