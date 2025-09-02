import { allPosts } from "content-collections"
import type { Metadata } from "next"
import { PostCard } from "~/components/web/posts/post-card"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Grid } from "~/components/web/ui/grid"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import { siteConfig } from "~/config/site"
import { getOpenGraphImageUrl } from "~/lib/opengraph"
import {
  createGraph,
  generateBlog,
  generateBreadcrumbs,
  generateWebPage,
  getOrganization,
  getWebSite,
} from "~/lib/structured-data"

const url = "/blog"
const title = `${siteConfig.name} Blog`
const description =
  "A collection of useful articles for developers and software enthusiasts. Learn about the latest trends and technologies in the community."
const ogImageUrl = getOpenGraphImageUrl({ title, description })
const breadcrumbs = [{ name: "Blog", url }]

export const metadata: Metadata = {
  title,
  description,
  alternates: { ...metadataConfig.alternates, canonical: url },
  openGraph: { ...metadataConfig.openGraph, url, images: [{ url: ogImageUrl }] },
}

const getStructuredData = (posts: typeof allPosts) => {
  const blogPosts = posts.map(post => ({
    title: post.title,
    description: post.description,
    path: post._meta.path,
    publishedAt: post.publishedAt,
  }))

  return createGraph([
    getOrganization(),
    getWebSite(),
    generateBreadcrumbs(breadcrumbs),
    generateBlog(url, title, description, blogPosts),
    generateWebPage(url, title, description),
  ])
}

export default function () {
  const posts = allPosts.toSorted((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  const structuredData = getStructuredData(posts)

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{title}</IntroTitle>
        <IntroDescription>{description}</IntroDescription>
      </Intro>

      {posts.length ? (
        <Grid>
          {posts.map(post => (
            <PostCard key={post._meta.path} post={post} />
          ))}
        </Grid>
      ) : (
        <p>No posts found.</p>
      )}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  )
}
