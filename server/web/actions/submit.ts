"use server"

import { getUrlHostname, slugify, tryCatch } from "@primoui/utils"
import { headers } from "next/headers"
import { after } from "next/server"
import { isDev } from "~/env"
import { auth } from "~/lib/auth"
import { isDisposableEmail } from "~/lib/email"
import { notifySubmitterOfToolSubmitted } from "~/lib/notifications"
import { getIP, isRateLimited } from "~/lib/rate-limiter"
import { actionClient } from "~/lib/safe-actions"
import { submitToolSchema } from "~/server/web/shared/schema"
import { db } from "~/services/db"
import { createResendContact } from "~/services/resend"

/**
 * Generates a unique slug by adding a numeric suffix if needed
 */
const generateUniqueSlug = async (baseName: string): Promise<string> => {
  const baseSlug = slugify(baseName)
  let slug = baseSlug
  let suffix = 2

  while (true) {
    // Check if slug exists
    if (!(await db.tool.findUnique({ where: { slug } }))) {
      return slug
    }

    // Add/increment suffix and try again
    slug = `${baseSlug}-${suffix}`
    suffix++
  }
}

/**
 * Submit a tool to the database
 * @param input - The tool data to submit
 * @returns The tool that was submitted
 */
export const submitTool = actionClient
  .inputSchema(submitToolSchema)
  .action(async ({ parsedInput: { newsletterOptIn, ...data } }) => {
    const session = await auth.api.getSession({ headers: await headers() })

    const ip = await getIP()
    const rateLimitKey = `submission:${ip}`
    const hostname = getUrlHostname(data.websiteUrl)

    // Rate limiting check
    if (await isRateLimited(rateLimitKey, "submission")) {
      throw new Error("Too many submissions. Please try again later.")
    }

    // Disposable email check
    if (!session?.user && (await isDisposableEmail(data.submitterEmail))) {
      throw new Error("Invalid email address, please use a real one")
    }

    if (newsletterOptIn) {
      await createResendContact({
        email: data.submitterEmail,
        firstName: data.submitterName,
      })
    }

    // Check if the tool already exists
    const existingTool = await db.tool.findFirst({
      where: { websiteUrl: { contains: hostname } },
    })

    // If the tool exists, redirect to the tool or submit page
    if (existingTool) {
      return existingTool
    }

    // Generate a unique slug
    const slug = await generateUniqueSlug(data.name)

    // Check if the email domain matches the tool's website domain
    const ownerId = session?.user.email.includes(hostname) ? session?.user.id : undefined

    // Save the tool to the database
    const { data: tool, error } = await tryCatch(
      db.tool.create({ data: { ...data, slug, ownerId } }),
    )

    if (error) {
      throw isDev ? error : new Error("Failed to submit tool")
    }

    // Notify the submitter of the tool submitted
    after(async () => await notifySubmitterOfToolSubmitted(tool))

    return tool
  })
