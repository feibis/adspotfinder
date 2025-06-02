"use server"

import { createServerAction } from "zsa"
import { env } from "~/env"
import { getIP, isRateLimited } from "~/lib/rate-limiter"
import { newsletterSchema } from "~/server/web/shared/schema"
import { resend } from "~/services/resend"
import { isDisposableEmail } from "~/utils/helpers"

/**
 * Subscribe to the newsletter
 * @param input - The newsletter data to subscribe to
 * @returns The newsletter that was subscribed to
 */
export const subscribeToNewsletter = createServerAction()
  .input(newsletterSchema)
  .handler(async ({ input: { value: email, captcha, ...payload } }) => {
    const audienceId = env.RESEND_AUDIENCE_ID
    const ip = await getIP()
    const rateLimitKey = `newsletter:${ip}`

    // Rate limiting check
    if (await isRateLimited(rateLimitKey, "newsletter")) {
      throw new Error("Too many attempts. Please try again later.")
    }

    // Disposable email check
    if (await isDisposableEmail(email)) {
      throw new Error("Invalid email address, please use a real one")
    }

    const { error } = await resend.contacts.create({ audienceId, email, ...payload })

    if (error) {
      throw new Error("Failed to subscribe to newsletter. Please try again later.")
    }

    return "You've been subscribed to the newsletter."
  })
