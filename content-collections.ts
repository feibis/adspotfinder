import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX, type Options } from "@content-collections/mdx"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"
import { extractHeadings } from "~/lib/headings"
import { defaultLocale, locales } from "~/lib/i18n"

const mdxOptions: Options = {
  rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
}

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "**/*.{md,mdx}",

  schema: z => ({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    publishedAt: z.string().pipe(z.coerce.date()),
    updatedAt: z.string().pipe(z.coerce.date()).optional(),
    author: z
      .object({
        name: z.string(),
        image: z.string(),
        url: z.string().optional(),
      })
      .optional(),
    locale: z.enum(locales).default(defaultLocale),
    headings: z
      .array(
        z.object({
          id: z.string(),
          text: z.string(),
          level: z.number(),
        }),
      )
      .optional(),
  }),

  transform: async (data, context) => {
    // Extract headings from raw content BEFORE compilation
    const headings = extractHeadings(data.content)

    // Compile MDX
    const result = await compileMDX(context, data, mdxOptions)
    const content = typeof result === "string" ? result : (result as { content: string }).content

    return { ...data, content, headings }
  },
})

export default defineConfig({
  collections: [posts],
})
