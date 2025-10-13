import { formatDate, getReadTime } from "@primoui/utils"
import { allPosts } from "content-collections"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { cache, Suspense } from "react"
import { H6 } from "~/components/common/heading"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { AdCard, AdCardSkeleton } from "~/components/web/ads/ad-card"
import { ExternalLink } from "~/components/web/external-link"
import { MDX } from "~/components/web/mdx"
import { Nav } from "~/components/web/nav"
import { StructuredData } from "~/components/web/structured-data"
import { Author } from "~/components/web/ui/author"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateArticle } from "~/lib/structured-data"

export const dynamicParams = false

type Props = PageProps<"/blog/[slug]">

// Get page data
const getData = cache(async ({ params }: Props) => {
  const { slug } = await params
  const post = allPosts.find(({ _meta }) => _meta.path === slug)

  if (!post) {
    notFound()
  }

  const t = await getTranslations()
  const url = `/blog/${post._meta.path}`

  const data = getPageData(url, post.title, post.description, {
    breadcrumbs: [
      { url: "/blog", title: t("navigation.blog") },
      { url, title: post.title },
    ],
    structuredData: [
      generateArticle(
        url,
        post.title,
        post.description,
        post.publishedAt,
        post.author,
        post.image,
        post.content.split(/\s+/).length,
      ),
    ],
  })

  return { post, ...data }
})

export const generateStaticParams = () => {
  return allPosts.map(({ _meta }) => ({ slug: _meta.path }))
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { url, metadata } = await getData(props)
  return getPageMetadata({ url, metadata })
}

export default async function (props: Props) {
  const { post, breadcrumbs, structuredData } = await getData(props)
  const t = await getTranslations()

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
            <span>{t("posts.read_time", { count: getReadTime(post.content) })}</span>
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

              <ExternalLink href={post.author.url} className="group">
                <Author {...post.author} />
              </ExternalLink>
            </Stack>
          )}
        </Section.Sidebar>
      </Section>

      <Nav title={post.title} className="self-start" />

      <StructuredData data={structuredData} />
    </>
  )
}
