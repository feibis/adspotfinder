import { getTranslations } from "next-intl/server"
import { type ComponentProps, Suspense } from "react"
import { CountBadge, CountBadgeSkeleton } from "~/app/(web)/(home)/count-badge"
import { CTAForm } from "~/components/web/cta-form"
import { CTAProof } from "~/components/web/cta-proof"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { cx } from "~/lib/utils"

export const Hero2 = async ({ className, ...props }: ComponentProps<"section">) => {
  const t = await getTranslations()

  return (
    <section className={cx("flex flex-col gap-y-6 w-full pb-6", className)} {...props}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Column - Text Content */}
        <div className="flex flex-col gap-y-6">
          <Intro alignment="start">
            <IntroTitle className="max-w-[16em] lg:text-5xl/[1.1]!">Find agencies for your business</IntroTitle>
            <IntroDescription className="lg:mt-2">Dedicated to helping businesses find the perfect agencies for their needs around the world.</IntroDescription>

            <Suspense fallback={<CountBadgeSkeleton />}>
              <CountBadge />
            </Suspense>
          </Intro>

          <CTAForm
            size="lg"
            className="max-w-sm items-start text-left"
            buttonProps={{ size: "md", variant: "fancy" }}
          >
            <CTAProof />
          </CTAForm>
        </div>

        {/* Right Column - Letters/Decorative Elements */}
        <div className="flex items-center justify-center lg:justify-end">
          <div className="relative">
            {/* Large decorative letters */}
            <div className="text-6xl lg:text-8xl xl:text-9xl font-bold text-primary/10 select-none pointer-events-none">
              <div className="leading-none">
                <span className="inline-block transform rotate-6 hover:rotate-12 transition-transform duration-300">D</span>
                <span className="inline-block transform -rotate-3 hover:rotate-6 transition-transform duration-300">I</span>
                <span className="inline-block transform rotate-12 hover:rotate-6 transition-transform duration-300">R</span>
              </div>
              <div className="leading-none mt-2 lg:mt-4">
                <span className="inline-block transform -rotate-6 hover:rotate-3 transition-transform duration-300">S</span>
                <span className="inline-block transform rotate-9 hover:-rotate-3 transition-transform duration-300">T</span>
                <span className="inline-block transform -rotate-9 hover:rotate-6 transition-transform duration-300">A</span>
                <span className="inline-block transform rotate-6 hover:-rotate-12 transition-transform duration-300">R</span>
                <span className="inline-block transform -rotate-3 hover:rotate-9 transition-transform duration-300">T</span>
                <span className="inline-block transform rotate-12 hover:rotate-6 transition-transform duration-300">E</span>
                <span className="inline-block transform -rotate-6 hover:rotate-3 transition-transform duration-300">R</span>
              </div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/5 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-accent/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
      </div>
    </section>
  )
}
