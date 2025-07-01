"use client"

import { SearchIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { useSearch } from "~/contexts/search-context"

export default function NotFound() {
  const pathname = usePathname()
  const search = useSearch()

  return (
    <Intro alignment="center">
      <IntroTitle>404 Not Found</IntroTitle>

      <IntroDescription className="max-w-xl">
        We're sorry, but the page {pathname} could not be found. You may have mistyped the address
        or the page may have moved.
      </IntroDescription>

      <Stack className="mt-4">
        <Button variant="fancy" onClick={search.open} prefix={<SearchIcon />}>
          Search for tools
        </Button>

        <Button variant="ghost" asChild>
          <Link href="/">Go back home</Link>
        </Button>
      </Stack>
    </Intro>
  )
}
