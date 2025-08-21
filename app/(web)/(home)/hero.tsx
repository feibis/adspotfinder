import { type ComponentProps, Suspense } from "react"
import { CountBadge, CountBadgeSkeleton } from "~/app/(web)/(home)/count-badge"
import { CTAForm } from "~/components/web/cta-form"
import { CTAProof } from "~/components/web/cta-proof"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { cx } from "~/lib/utils"

export const Hero = ({ className, ...props }: ComponentProps<"section">) => {
  return (
    <section className={cx("flex flex-col gap-y-6 w-full pb-6", className)} {...props}>
      <Intro alignment="center">
        <IntroTitle className="max-w-[16em] lg:text-5xl/[1.1]!">{siteConfig.tagline}</IntroTitle>

        <IntroDescription className="lg:mt-2">{siteConfig.description}</IntroDescription>

        <Suspense fallback={<CountBadgeSkeleton />}>
          <CountBadge />
        </Suspense>
      </Intro>

      <CTAForm
        size="lg"
        className="max-w-sm mx-auto items-center text-center"
        buttonProps={{ children: "Join our community", size: "md", variant: "fancy" }}
      >
        <CTAProof />
      </CTAForm>
    </section>
  )
}
