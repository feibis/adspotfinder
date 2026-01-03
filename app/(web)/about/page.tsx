import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { cache } from "react"
import { Link } from "~/components/common/link"
import { Prose } from "~/components/common/prose"
import { ExternalLink } from "~/components/web/external-link"
import { StructuredData } from "~/components/web/structured-data"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { CenteredSection } from "~/components/web/ui/section"
import { linksConfig } from "~/config/links"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateAboutPage } from "~/lib/structured-data"

// I18n page namespace
const namespace = "pages.about"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/about"
  const title = t(`${namespace}.title`)
  const description = t(`${namespace}.description`, { siteName: siteConfig.name })

  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
    structuredData: [generateAboutPage(url, title, description)],
  })
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  return getPageMetadata({ url, metadata })
}

export default async function () {
  const { metadata, structuredData } = await getData()

  return (
    <>
      <CenteredSection>
        <CenteredSection.Content>
          <Intro alignment="center">
            <IntroTitle>{metadata.title}</IntroTitle>
            <IntroDescription>{metadata.description}</IntroDescription>
          </Intro>

          <div className="max-w-4xl">
            <Prose>
            <h2>How Adspotfinder Started</h2>

            <p>
              When I launched my open-source product, I struggled to find good advertising platforms to reach my target audience. Most free advertising sites required lengthy approval processes that could take weeks, and even then, there was no guarantee of placement or visibility.
            </p>

            <p>
              Google Ads didn't work reliably for niche developer audiences - it was too much of a hit-or-miss approach. I needed more control over where my ads appeared and assurance that my budget was being spent effectively.
            </p>

            <p>
              That's when I discovered the value of niche advertising platforms. These specialized sites offered clear pricing, straightforward approval processes, and most importantly - guaranteed placement in communities where my target users actually spent time. The processes were always clear, easy to understand, and budget-friendly.
            </p>

            <p>
              <Link href="/">{siteConfig.name}</Link> was born from this experience. I wanted to create a platform that makes it easy for developers and creators to find high-quality, niche advertising opportunities without the hassle of unclear processes, hidden fees, or unreliable placements.
            </p>

            <h2>About the Author</h2>

            <p>
              I'm a software developer and entrepreneur. I've been building web applications for over 15
              years. I'm passionate about software development and I love to contribute to the community
              in any way I can.
            </p>

            <p>
              I'm always looking for new projects to work on and new people to collaborate with. Feel
              free to reach out to me if you have any questions or suggestions.
            </p>

            <p>
              –{" "}
              <ExternalLink href={linksConfig.author} doFollow>
                Fabian Likam
              </ExternalLink>
            </p>
            </Prose>
          </div>
        </CenteredSection.Content>
      </CenteredSection>

      <StructuredData data={structuredData} />
    </>
  )
}
