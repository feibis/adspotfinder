import GithubSlugger from "github-slugger"

export type Heading = {
  id: string
  text: string
  level: number
}

/**
 * Extract headings from raw markdown/MDX content without compiling to HTML.
 * Generates GitHub-compatible slug IDs (same as rehype-slug).
 */
export const extractHeadings = (markdown: string): Heading[] => {
  const slugger = new GithubSlugger()
  const headings: Heading[] = []

  // Remove code blocks first to avoid matching headings inside them
  const withoutCodeBlocks = markdown.replace(/```[\s\S]*?```/g, "")

  // Match markdown headings: ^#{1,6}\s+(.+)$
  const headingRegex = /^(#{1,6})\s+(.+)$/gm

  let match: RegExpExecArray | null
  while (true) {
    match = headingRegex.exec(withoutCodeBlocks)
    if (!match) break

    const level = match[1].length
    const text = match[2].trim()

    // Generate GitHub-compatible slug (matches rehype-slug behavior)
    const id = slugger.slug(text)

    headings.push({ id, text, level })
  }

  return headings
}
