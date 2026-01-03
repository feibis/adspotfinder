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
    <section className={cx("flex flex-col gap-y-8 w-full py-8", className)} {...props}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column - Text Content */}
        <div className="flex flex-col gap-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              Find the Perfect{" "}
              <span className="text-primary">Agency</span>{" "}
              for Your Business
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              Connect with top-rated agencies specializing in advertising, marketing, and business growth.
              Browse our curated collection of professional agencies ready to elevate your brand.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Verified Agencies Only</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Expertise Across Industries</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Proven Track Records</span>
            </div>
          </div>
        </div>

        {/* Right Column - Visual Elements */}
        <div className="flex items-center justify-center lg:justify-end">
          <div className="relative">
            {/* Large decorative agency-related elements */}
            <div className="text-6xl lg:text-8xl xl:text-9xl font-bold text-primary/10 select-none pointer-events-none">
              <div className="leading-none">
                <span className="inline-block transform rotate-6 hover:rotate-12 transition-transform duration-300">A</span>
                <span className="inline-block transform -rotate-3 hover:rotate-6 transition-transform duration-300">G</span>
                <span className="inline-block transform rotate-12 hover:rotate-6 transition-transform duration-300">E</span>
                <span className="inline-block transform -rotate-6 hover:rotate-3 transition-transform duration-300">N</span>
                <span className="inline-block transform rotate-9 hover:-rotate-3 transition-transform duration-300">C</span>
                <span className="inline-block transform -rotate-9 hover:rotate-6 transition-transform duration-300">Y</span>
              </div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary/5 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-accent/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 -left-8 w-12 h-12 bg-primary/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>

    </section>
  )
}
