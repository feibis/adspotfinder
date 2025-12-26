"use client"

import { SearchIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useQueryState } from "nuqs"
import { Input } from "~/components/common/input"
import { Stack } from "~/components/common/stack"

export type AttributeSearchProps = {
  placeholder?: string
}

const AttributeSearch = ({ placeholder }: AttributeSearchProps) => {
  const t = useTranslations()
  const [search, setSearch] = useQueryState("q", { defaultValue: "" })

  return (
    <Stack size="sm" className="w-full max-w-md">
      <Input
        size="lg"
        prefix={<SearchIcon />}
        placeholder={placeholder || t("attributes.filters.search_placeholder")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </Stack>
  )
}

export { AttributeSearch }
