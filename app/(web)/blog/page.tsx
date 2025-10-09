import { allPosts } from "content-collections"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { cache } from "react"
import { PostList } from "~/components/web/posts/post-list"
import { StructuredData } from "~/components/web/structured-data"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateBlog } from "~/lib/structured-data"

const getData = cache(async () => {
  const posts = allPosts.toSorted((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  const blogPosts = posts.map(post => ({
    title: post.title,
    description: post.description,
    path: post._meta.path,
    publishedAt: post.publishedAt,
  }))

  const t = await getTranslations("pages.blog")
  const url = "/blog"
  const title = t("meta.title")
  const description = t("meta.description", { siteName: siteConfig.name })

  const data = getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
    structuredData: [generateBlog(url, title, description, blogPosts)],
  })

  return { posts, ...data }
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  return getPageMetadata({ url, metadata })
}

export default async function () {
  const { posts, metadata, breadcrumbs, structuredData } = await getData()

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <PostList posts={posts} />

      <StructuredData data={structuredData} />
    </>
  )
}
