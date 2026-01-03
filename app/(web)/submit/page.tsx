import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { cache } from "react"
import { SubmitForm } from "~/app/(web)/submit/form"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { CenteredSection } from "~/components/web/ui/section"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"

// I18n page namespace
const namespace = "pages.submit"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/submit"
  const title = t(`${namespace}.title`)
  const description = t(`${namespace}.description`, { siteName: siteConfig.name })

  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
  })
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  return getPageMetadata({ url, metadata })
}

export default async function () {
  const { metadata } = await getData()

  return (
    <>
      <CenteredSection>
        <CenteredSection.Content>
          <Intro alignment="center">
            <IntroTitle>{metadata.title}</IntroTitle>
            <IntroDescription>{metadata.description}</IntroDescription>
          </Intro>

          <SubmitForm />
        </CenteredSection.Content>
      </CenteredSection>
    </>
  )
}
