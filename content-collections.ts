import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX, type Options } from "@content-collections/mdx"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"
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
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    author: z
      .object({
        name: z.string(),
        image: z.string(),
        title: z.string().optional(),
        url: z.string().optional(),
      })
      .optional(),
    locale: z.enum(locales).default(defaultLocale),
  }),

  transform: async (data, context) => {
    const content = await compileMDX(context, data, mdxOptions)
    return { ...data, content }
  },
})

export default defineConfig({
  collections: [posts],
})
