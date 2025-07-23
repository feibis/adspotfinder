import type { Metadata } from "next"
import { cache } from "react"
import { Link } from "~/components/common/link"
import { Prose } from "~/components/common/prose"
import { ExternalLink } from "~/components/web/external-link"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { linksConfig } from "~/config/links"
import { siteConfig } from "~/config/site"
import { getI18nMetadata, getPageMetadata } from "~/lib/metadata"
import {
  createGraph,
  generateAboutPage,
  generateBreadcrumbs,
  generateWebPage,
  getOrganization,
  getWebSite,
} from "~/lib/structured-data"

const getPageData = cache(async () => {
  const url = "/about"

  const metadata = await getI18nMetadata("pages.about", t => ({
    title: t("meta.title"),
    description: t("meta.description", { siteName: siteConfig.name }),
  }))

  const breadcrumbs = [{ name: "About", url }]

  const structuredData = createGraph([
    getOrganization(),
    getWebSite(),
    generateBreadcrumbs(breadcrumbs),
    generateWebPage(url, metadata.title, metadata.description),
    generateAboutPage(url, metadata.title, metadata.description),
  ])

  return { url, metadata, breadcrumbs, structuredData }
})

export const generateMetadata = async (): Promise<Metadata> => {
  return getPageMetadata(await getPageData())
}

export default async function () {
  const { metadata, structuredData } = await getPageData()
  const { title, description } = metadata

  return (
    <>
      <Intro>
        <IntroTitle>{title}</IntroTitle>
        <IntroDescription>{description}</IntroDescription>
      </Intro>

      <Prose>
        <h2>What is {siteConfig.name}?</h2>

        <p>
          <Link href="/" title={siteConfig.tagline}>
            {siteConfig.name}
          </Link>{" "}
          is a community driven list of <strong>tools and resources for developers</strong>. The
          goal of the site is to be your first stop when researching for a new tool or resource to
          help you grow your business. It will help you find alternatives and reviews of the
          products you already use.
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
            Piotr Kulpinski
          </ExternalLink>
        </p>
      </Prose>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  )
}
