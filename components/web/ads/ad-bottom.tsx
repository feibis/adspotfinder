import Image from "next/image"
import type { ComponentProps } from "react"
import { Button } from "~/components/common/button"
import { Card, CardBadges } from "~/components/common/card"
import { AdBadge, AdLink } from "~/components/web/ads/ad-base"
import { Favicon } from "~/components/web/ui/favicon"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { findAdWithFallback } from "~/server/web/actions/ads"

export const AdBottom = async ({ ...props }: ComponentProps<typeof Card>) => {
  const type = "Bottom"
  const { data: ad } = await findAdWithFallback({ type, fallback: [] })

  if (!ad) {
    return null
  }

  return (
    <Card isHighlighted asChild {...props}>
      <AdLink ad={ad} type={type} source="bottom">
        <CardBadges>
          <AdBadge />
        </CardBadges>

        {ad.bannerUrl ? (
          <Image
            src={ad.bannerUrl}
            alt={ad.name}
            width={1024}
            height={574}
            className="w-full -m-5 rounded-md"
          />
        ) : (
          // Fallback to a custom banner
          <div className="w-full flex flex-col items-center justify-center gap-3 p-8 text-center">
            <Favicon
              src={ad.faviconUrl ?? "/favicon.png"}
              title={ad.name}
              className="size-12 rounded-lg"
            />

            <Intro alignment="center">
              <IntroTitle size="h2">{ad.name}</IntroTitle>
              <IntroDescription>{ad.description}</IntroDescription>
            </Intro>

            <Button className="mt-2 pointer-events-none" asChild>
              <span>{ad.buttonLabel ?? "Learn More"}</span>
            </Button>
          </div>
        )}
      </AdLink>
    </Card>
  )
}
