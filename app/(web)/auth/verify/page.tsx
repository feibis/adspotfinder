import type { Metadata } from "next"
import { Link } from "~/components/common/link"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"
import { getOpenGraphImageUrl } from "~/lib/opengraph"

const url = "/check-inbox"
const title = "Check your inbox"
const description = `Check your inbox to sign in to ${config.site.name}.`
const ogImageUrl = getOpenGraphImageUrl({ title, description })

export const metadata: Metadata = {
  title,
  description,
  alternates: { ...metadataConfig.alternates, canonical: url },
  openGraph: { ...metadataConfig.openGraph, url, images: [{ url: ogImageUrl }] },
}

export default async function ({ searchParams }: PageProps<"/auth/verify">) {
  const { email } = await searchParams

  return (
    <>
      <Intro>
        <IntroTitle size="h3">{title}</IntroTitle>
        <IntroDescription className="md:text-sm">
          We've sent you a magic link to <strong className="text-foreground">{email}</strong>.
          Please click the link to confirm your address.
        </IntroDescription>
      </Intro>

      <p className="text-xs text-muted-foreground/75">
        No email in your inbox? Check your spam folder or{" "}
        <Link
          href="/auth/login"
          className="text-muted-foreground font-medium hover:text-foreground"
        >
          try a different email address
        </Link>
        .
      </p>
    </>
  )
}
