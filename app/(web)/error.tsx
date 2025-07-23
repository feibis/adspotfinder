"use client"

import { useTranslations } from "next-intl"
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
  const t = useTranslations("pages.error")
  const email = env.NEXT_PUBLIC_SITE_EMAIL

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <Intro alignment="center">
      <IntroTitle>{t("meta.title")}</IntroTitle>

      <IntroDescription className="max-w-xl">
        {t("meta.description", { email })}
        We're sorry, but we encountered an error. Please try again, and if the problem persists,
        contact support at <Link href={`mailto:${email}`}>{email}</Link>.
      </IntroDescription>

      <Stack className="mt-4">
        <Button variant="fancy" onClick={reset}>
          {t("reload_button")}
        </Button>

        <Button variant="soft" asChild>
          <Link href="/">{t("home_button")}</Link>
        </Button>
      </Stack>
    </Intro>
  )
}
