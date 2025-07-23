import type { Metadata } from "next"
import { SubmitForm } from "~/app/(web)/submit/form"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { siteConfig } from "~/config/site"
import { getI18nMetadata, getPageMetadata } from "~/lib/metadata"

const getPageData = async () => {
  const url = "/submit"

  const metadata = await getI18nMetadata("pages.submit", t => ({
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
        <IntroTitle>{title}</IntroTitle>
        <IntroDescription>{description}</IntroDescription>
      </Intro>

      <Section>
        <Section.Content>
          <SubmitForm />
        </Section.Content>
      </Section>
    </>
  )
}
