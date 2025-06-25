import { Suspense } from "react"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { Listing } from "~/components/web/listing"
import { FeaturedTools } from "~/components/web/listings/featured-tools"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"

export default function NotFound() {
  return (
    <>
      <Intro className="mb-8">
        <IntroTitle>404 Not Found</IntroTitle>

        <IntroDescription className="max-w-xl">
          We're sorry, but the page could not be found. You may have mistyped the address or the
          page may have moved.
        </IntroDescription>

        <Button size="lg" className="mt-4" asChild>
          <Link href="/">Go back home</Link>
        </Button>
      </Intro>

      <Suspense
        fallback={
          <Listing title="Featured Tools">
            <ToolListSkeleton count={6} />
          </Listing>
        }
      >
        <FeaturedTools />
      </Suspense>
    </>
  )
}
