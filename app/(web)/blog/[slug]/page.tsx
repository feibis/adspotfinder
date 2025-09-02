import { formatDate, getReadTime } from "@primoui/utils"
import { allPosts, type Post } from "content-collections"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"
import { H6 } from "~/components/common/heading"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { AdCard, AdCardSkeleton } from "~/components/web/ads/ad-card"
import { ExternalLink } from "~/components/web/external-link"
import { MDX } from "~/components/web/mdx"
import { Nav } from "~/components/web/nav"
import { Author } from "~/components/web/ui/author"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { metadataConfig } from "~/config/metadata"
import { getOpenGraphImageUrl } from "~/lib/opengraph"
import {
  createGraph,
  generateArticle,
  generateBreadcrumbs,
  generateWebPage,
  getOrganization,
  getWebSite,
} from "~/lib/structured-data"

const findPostBySlug = cache(async ({ params }: PageProps<"/blog/[slug]">) => {
  const { slug } = await params
  const post = allPosts.find(({ _meta }) => _meta.path === slug)

  if (!post) {
    notFound()
  }

  return post
})

const getMetadata = (post: Post) => {
  return {
    url: `/blog/${post._meta.path}`,
    title: post.title,
    description: post.description,
  }
}

const getBreadcrumbs = (post: Post) => {
  return [
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${post._meta.path}` },
  ]
}

const getStructuredData = (post: Post) => {
  const breadcrumbs = getBreadcrumbs(post)
  const { url, title, description } = getMetadata(post)

  // Calculate word count from MDX content
  const wordCount = post.content.split(/\s+/).length

  return createGraph([
    getOrganization(),
    getWebSite(),
    generateBreadcrumbs(breadcrumbs),
    generateArticle(
      url,
      title,
      description,
      post.publishedAt,
      post.author
        ? {
            name: post.author.name,
            url: `https://twitter.com/${post.author.twitterHandle}`,
          }
        : undefined,
      post.image,
      wordCount,
    ),
    generateWebPage(url, title, description),
  ])
}

export const generateStaticParams = () => {
  return allPosts.map(({ _meta }) => ({ slug: _meta.path }))
}

export const generateMetadata = async (props: PageProps<"/blog/[slug]">): Promise<Metadata> => {
  const post = await findPostBySlug(props)
  const { url, title, description } = getMetadata(post)
  const ogImageUrl = getOpenGraphImageUrl({ title, description })

  return {
    title,
    description,
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url, images: [{ url: ogImageUrl }] },
  }
}

export default async function (props: PageProps<"/blog/[slug]">) {
  const post = await findPostBySlug(props)
  const breadcrumbs = getBreadcrumbs(post)
  const structuredData = getStructuredData(post)

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{post.title}</IntroTitle>
        <IntroDescription>{post.description}</IntroDescription>

        <Stack size="lg" className="mt-4">
          <Nav title={post.title} />

          <Note>
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            )}

            <span className="px-2">&bull;</span>
            <span>{getReadTime(post.content)} min read</span>
          </Note>
        </Stack>
      </Intro>

      <Section>
        <Section.Content>
          {post.image && (
            <Image
              src={post.image}
              alt={post.title}
              width={1200}
              height={630}
              className="w-full h-auto aspect-video object-cover rounded-lg"
            />
          )}

          <MDX code={post.content} />
        </Section.Content>

        <Section.Sidebar>
          <Suspense fallback={<AdCardSkeleton className="max-md:hidden" />}>
            <AdCard type="BlogPost" className="max-md:hidden" />
          </Suspense>

          {post.author && (
            <Stack direction="column" className="lg:mx-5">
              <H6 as="strong" className="text-muted-foreground">
                Written by
              </H6>

              <ExternalLink
                href={`https://twitter.com/${post.author.twitterHandle}`}
                className="group"
              >
                <Author
                  name={post.author.name}
                  image={post.author.image}
                  title={`@${post.author.twitterHandle}`}
                />
              </ExternalLink>
            </Stack>
          )}
        </Section.Sidebar>
      </Section>

      <Nav title={post.title} className="self-start" />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  )
}
