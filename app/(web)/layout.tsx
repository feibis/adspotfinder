import Script from "next/script"
import { getLocale, getMessages, getTimeZone } from "next-intl/server"
import { type PropsWithChildren, Suspense } from "react"
import { Providers } from "~/app/(web)/providers"
import { Wrapper } from "~/components/common/wrapper"
import { AdBanner } from "~/components/web/ads/ad-banner"
import { Bottom } from "~/components/web/bottom"
import { FeedbackWidget } from "~/components/web/feedback-widget"
import { Footer } from "~/components/web/footer"
import { Header } from "~/components/web/header"
import { Backdrop } from "~/components/web/ui/backdrop"
import { Container } from "~/components/web/ui/container"
import { env } from "~/env"

export default async function ({ children }: PropsWithChildren) {
  const locale = await getLocale()
  const messages = await getMessages()
  const timeZone = await getTimeZone()

  return (
    <Providers locale={locale} messages={messages} timeZone={timeZone}>
      <div className="flex flex-col min-h-dvh overflow-clip pt-(--header-inner-offset)">
        <Header />

        <Backdrop isFixed />

        <Suspense>
          <AdBanner />
        </Suspense>

        <Container asChild>
          <Wrapper className="grow py-fluid-md">
            {children}

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
