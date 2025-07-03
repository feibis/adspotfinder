import { getRandomDigits } from "@primoui/utils"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { admin, magicLink, oneTimeToken } from "better-auth/plugins"
import { headers } from "next/headers"
import { cache } from "react"
import { config } from "~/config"
import { claimsConfig } from "~/config/claims"
import EmailMagicLink from "~/emails/magic-link"
import { env } from "~/env"
import { sendEmail } from "~/lib/email"
import { db } from "~/services/db"

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
  },

  session: {
    cookieCache: {
      enabled: true,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
    },
  },

  onAPIError: {
    onError: error => console.error(error),
  },

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const to = email
        const subject = `Your ${config.site.name} Login Link`
        await sendEmail({ to, subject, react: EmailMagicLink({ to, url }) })
      },
    }),

    oneTimeToken({
      expiresIn: claimsConfig.otpExpiration,
      generateToken: async () => getRandomDigits(claimsConfig.otpLength),
    }),

    admin(),
  ],
})

export const getServerSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  })
})

export type Session = typeof auth.$Infer.Session
