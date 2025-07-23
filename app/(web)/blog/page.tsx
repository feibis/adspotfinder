import { allPosts } from "content-collections"
import type { Metadata } from "next"
import { cache } from "react"
import { PostList } from "~/components/web/posts/post-list"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getI18nMetadata, getPageMetadata } from "~/lib/metadata"
import {
  createGraph,
  generateBlog,
  generateBreadcrumbs,
  generateWebPage,
  getOrganization,
  getWebSite,
} from "~/lib/structured-data"

const getPageData = cache(async () => {
  const url = "/blog"

  const metadata = await getI18nMetadata("pages.blog", t => ({
    title: t("meta.title"),
    description: t("meta.description", { siteName: siteConfig.name }),
  }))

  const breadcrumbs = [{ name: "Blog", url }]

  const posts = allPosts.toSorted((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  const blogPosts = posts.map(post => ({
    title: post.title,
    description: post.description,
    path: post._meta.path,
    publishedAt: post.publishedAt,
  }))

  const structuredData = createGraph([
    getOrganization(),
    getWebSite(),
    generateBreadcrumbs(breadcrumbs),
    generateBlog(url, metadata.title, metadata.description, blogPosts),
    generateWebPage(url, metadata.title, metadata.description),
  ])

  return { posts, url, metadata, breadcrumbs, structuredData }
})

export const generateMetadata = async (): Promise<Metadata> => {
  return getPageMetadata(await getPageData())
}

export default async function () {
  const { posts, metadata, breadcrumbs, structuredData } = await getPageData()
  const { title, description } = metadata

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{title}</IntroTitle>
        <IntroDescription>{description}</IntroDescription>
      </Intro>

      <PostList posts={posts} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  )
}
