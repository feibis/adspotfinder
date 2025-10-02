"use client"

import { useEffect } from "react"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { env } from "~/env"

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <Intro alignment="center">
      <IntroTitle>Something went wrong!</IntroTitle>

      <IntroDescription className="max-w-xl">
        We're sorry, but we encountered an error. Please try again, and if the problem persists,
        contact support at{" "}
        <Link href={`mailto:${env.NEXT_PUBLIC_SITE_EMAIL}`}>{env.NEXT_PUBLIC_SITE_EMAIL}</Link>.
      </IntroDescription>

      <Stack className="mt-4">
        <Button variant="fancy" onClick={reset}>
          Reload the page
        </Button>

        <Button variant="soft" asChild>
          <Link href="/">Go back home</Link>
        </Button>
      </Stack>
    </Intro>
  )
}
