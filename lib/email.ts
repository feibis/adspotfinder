import { render } from "@react-email/components"
import type { ReactElement } from "react"
import type { CreateEmailOptions } from "resend"
import wretch from "wretch"
import { config } from "~/config"
import { env, isProd } from "~/env"
import { resend } from "~/services/resend"

export type EmailParams = {
  to: string
  subject: string
  react: ReactElement
  replyTo?: string
}

/**
 * Prepares an email for sending
 * @param email - The email to prepare
 * @returns The prepared email
 */
const prepareEmail = async (email: EmailParams): Promise<CreateEmailOptions> => {
  return {
    from: `${config.site.name} <${env.RESEND_SENDER_EMAIL}>`,
    replyTo: email.replyTo ?? (email.to !== config.site.email ? email.to : undefined),
    to: email.to,
    subject: email.subject,
    react: email.react,
    text: await render(email.react, { plainText: true }),
  }
}

/**
 * Sends an email to the given recipient using Resend
 * @param email - The email to send
 * @returns The response from Resend
 */
export const sendEmail = async (email: EmailParams) => {
  const preparedEmail = await prepareEmail(email)

  if (!isProd) {
    console.log(preparedEmail)
    return
  }

  return resend.emails.send(preparedEmail)
}

/**
 * Checks if an email is a disposable email by checking if the domain is in the disposable domains list
 * @param email - The email to check
 * @returns True if the email is a disposable email, false otherwise
 */
export const isDisposableEmail = async (email: string) => {
  const disposableJsonURL =
    "https://rawcdn.githack.com/disposable/disposable-email-domains/master/domains.json"

  const disposableDomains = await wretch(disposableJsonURL).get().json<string[]>()
  const domain = email.split("@")[1]

  return disposableDomains.includes(domain)
}
