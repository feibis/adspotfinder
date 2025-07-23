"use client"

import { SearchIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { useSearch } from "~/contexts/search-context"

export default function () {
  const t = useTranslations("pages.not_found")
  const pathname = usePathname()
  const search = useSearch()

  return (
    <Intro alignment="center">
      <IntroTitle>{t("title")}</IntroTitle>
      <IntroDescription className="max-w-xl">{t("description", { pathname })}</IntroDescription>

      <Stack className="mt-4">
        <Button variant="fancy" onClick={search.open} prefix={<SearchIcon />}>
          {t("search_button")}
        </Button>

        <Button variant="soft" asChild>
          <Link href="/">{t("home_button")}</Link>
        </Button>
      </Stack>
    </Intro>
  )
}
