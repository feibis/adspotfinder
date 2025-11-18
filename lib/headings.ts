import GithubSlugger from "github-slugger"

export type Heading = {
  id: string
  text: string
  level: number
}

/**
 * Strip markdown formatting from text, leaving only plain text.
 * Handles common markdown syntax like bold, italic, links, code, etc.
 */
const stripMarkdown = (text: string): string => {
  return (
    text
      // Remove inline code
      .replace(/`([^`]+)`/g, "$1")
      // Remove bold/italic (**, __, *, _)
      .replace(/(\*\*|__)(.*?)\1/g, "$2")
      .replace(/(\*|_)(.*?)\1/g, "$2")
      // Remove links [text](url) -> text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Remove images ![alt](url) -> alt
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
      // Remove strikethrough ~~text~~
      .replace(/~~(.*?)~~/g, "$1")
      // Remove HTML tags
      .replace(/<[^>]+>/g, "")
      // Clean up extra whitespace
      .replace(/\s+/g, " ")
      .trim()
  )
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
    const rawText = match[2].trim()

    // Strip markdown formatting from heading text
    const text = stripMarkdown(rawText)

    // Generate GitHub-compatible slug (matches rehype-slug behavior)
    const id = slugger.slug(text)

    headings.push({ id, text, level })
  }

  return headings
}
