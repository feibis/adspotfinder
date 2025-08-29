import { usePathname, useSearchParams } from "next/navigation"
import { usePostHog } from "posthog-js/react"
import { Suspense, useEffect } from "react"

export function PosthogPageview() {
  return (
    <Suspense>
      <PosthogPageviewClient />
    </Suspense>
  )
}

const PosthogPageviewClient = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()
  const searchParamsString = searchParams.toString()

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname

      if (searchParamsString) {
        url = `${url}?${searchParamsString}`
      }

      posthog.capture("$pageview", { $current_url: url })
    }
  }, [pathname, searchParamsString, posthog])

  return null
}
