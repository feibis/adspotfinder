import { addSearchParams } from "@primoui/utils"
import { ToolStatus } from "@prisma/client"
import RSS from "rss"
import { config } from "~/config"
import { db } from "~/services/db"

export const GET = async () => {
  const { url, domain, name, tagline } = config.site
  const rssSearchParams = { utm_source: domain, utm_medium: "rss" }

  const tools = await db.tool.findMany({
    where: { status: ToolStatus.Published },
    orderBy: { publishedAt: "desc" },
    take: 50,
    select: {
      name: true,
      slug: true,
      description: true,
      websiteUrl: true,
      publishedAt: true,
      categories: true,
    },
  })

  const feed = new RSS({
    title: name,
    description: tagline,
    site_url: addSearchParams(url, rssSearchParams),
    feed_url: `${url}/rss.xml`,
    copyright: `${new Date().getFullYear()} ${name}`,
    language: "en",
    ttl: 14400,
    pubDate: new Date(),
  })

  for (const tool of tools) {
    feed.item({
      guid: tool.websiteUrl,
      title: tool.name,
      url: addSearchParams(`${url}/${tool.slug}`, rssSearchParams),
      date: tool.publishedAt?.toUTCString() ?? new Date().toUTCString(),
      description: tool.description ?? "",
      categories: tool.categories?.map(({ name }) => name) || [],
    })
  }

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=14400",
    },
  })
}
