import { getSessionCookie } from "better-auth/cookies"
import { headers } from "next/headers"
import Script from "next/script"
import { Suspense } from "react"
import { Providers } from "~/app/(web)/providers"
import { Wrapper } from "~/components/common/wrapper"
import { AdBanner } from "~/components/web/ads/ad-banner"
import { AdBottom } from "~/components/web/ads/ad-bottom"
import { Bottom } from "~/components/web/bottom"
import { FeedbackWidget } from "~/components/web/feedback-widget"
import { Footer } from "~/components/web/footer"
import { Header } from "~/components/web/header"
import { Backdrop } from "~/components/web/ui/backdrop"
import { Container } from "~/components/web/ui/container"
import { env } from "~/env"
import { getServerSession } from "~/lib/auth"

export default async function ({ children }: LayoutProps<"/">) {
  const hasSessionCookie = getSessionCookie(new Headers(await headers()))
  const session = hasSessionCookie ? await getServerSession() : null

  return (
    <Providers>
      <div className="flex flex-col min-h-dvh overflow-clip pt-(--header-inner-offset)">
        <Header session={session} />
        <Backdrop isFixed />

        <Suspense>
          <AdBanner />
        </Suspense>

        <Container asChild>
          <Wrapper className="grow py-fluid-md">
            {children}

            <Suspense>
              <AdBottom />
            </Suspense>

            <Footer />
          </Wrapper>
        </Container>
      </div>

      <Bottom />
      <FeedbackWidget />

      {/* Plausible */}
      <Script
        defer
        data-domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
        src={`${env.NEXT_PUBLIC_PLAUSIBLE_URL}/js/script.js`}
      />
    </Providers>
  )
}
