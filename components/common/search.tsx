"use client"

import { type HotkeyItem, useDebouncedState, useHotkeys } from "@mantine/hooks"
import { getUrlHostname } from "@primoui/utils"
import { LoaderIcon, MoonIcon, SunIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import type { InferSafeActionFnResult } from "next-safe-action"
import { useAction } from "next-safe-action/hooks"
import { useTheme } from "next-themes"
import posthog from "posthog-js"
import { type ComponentProps, type ReactNode, useEffect, useRef, useState } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "~/components/common/command"
import { Kbd } from "~/components/common/kbd"
import { useSearch } from "~/contexts/search-context"
import { useSession } from "~/lib/auth-client"
import { searchItems } from "~/server/web/actions/search"

type SearchResultsProps<T> = {
  name: string
  items: T[] | undefined
  onItemSelect: (url: string) => void
  getHref: (item: T) => string
  renderItemDisplay: (item: T) => ReactNode
}

const SearchResults = <T extends { slug: string; name: string }>({
  name,
  items,
  onItemSelect,
  getHref,
  renderItemDisplay,
}: SearchResultsProps<T>) => {
  if (!items?.length) return null

  return (
    <CommandGroup heading={name}>
      {items.map(item => (
        <CommandItem
          key={item.slug}
          value={`${name.toLowerCase()}:${item.slug}`}
          onSelect={() => onItemSelect(getHref(item))}
        >
          {renderItemDisplay(item)}
        </CommandItem>
      ))}
    </CommandGroup>
  )
}

type CommandSection = {
  name: string
  items: {
    value?: string
    label: string
    shortcut?: ComponentProps<typeof CommandShortcut>
    icon?: ReactNode
    isPending?: boolean
    onSelect: () => void
  }[]
}

export const Search = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearch()
  const [results, setResults] = useState<InferSafeActionFnResult<typeof searchItems>["data"]>()
  const { resolvedTheme, setTheme, forcedTheme } = useTheme()
  const [query, setQuery] = useDebouncedState("", 250)
  const listRef = useRef<HTMLDivElement>(null)

  const isAdmin = session?.user.role === "admin"
  const isAdminPath = pathname.startsWith("/admin")
  const hasQuery = !!query.length

  const clearSearch = () => {
    setTimeout(() => {
      setResults(undefined)
      setQuery("")
    }, 250)
  }

  const handleOpenChange = (open: boolean) => {
    open ? search.open() : search.close()
    if (!open) clearSearch()
  }

  const navigateTo = (path: string) => {
    router.push(path)
    handleOpenChange(false)
  }

  const commandSections: CommandSection[] = []
  const hotkeys: HotkeyItem[] = [["mod+K", () => search.open()]]

  // Admin command sections & hotkeys
  if (isAdmin) {
    commandSections.push({
      name: "Create",
      items: [
        {
          label: "New Tool",
          shortcut: { meta: true, children: "1" },
          onSelect: () => navigateTo("/admin/tools/new"),
        },
        {
          label: "New Category",
          shortcut: { meta: true, children: "2" },
          onSelect: () => navigateTo("/admin/categories/new"),
        },
        {
          label: "New Tag",
          shortcut: { meta: true, children: "3" },
          onSelect: () => navigateTo("/admin/tags/new"),
        },
      ],
    })

    // User command sections & hotkeys
  } else {
    commandSections.push({
      name: "Quick Links",
      items: [
        { label: "Tools", onSelect: () => navigateTo("/") },
        { label: "Categories", onSelect: () => navigateTo("/categories") },
        { label: "Tags", onSelect: () => navigateTo("/tags") },
      ],
    })
  }

  if (!forcedTheme) {
    commandSections.push({
      name: "Appearance",
      items: [
        {
          value: "theme",
          label: `Switch to ${resolvedTheme === "dark" ? "Light" : "Dark"} Mode`,
          icon: resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />,
          shortcut: { meta: true, shift: true, children: "L" },
          onSelect: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
        },
      ],
    })
  }

  for (const [_, { shortcut, onSelect }] of commandSections
    .flatMap(({ items }) => items)
    .entries()) {
    if (!shortcut) continue

    const mods = []
    if (shortcut.shift) mods.push("shift")
    if (shortcut.meta) mods.push("mod")
    if (shortcut.alt) mods.push("alt")
    if (shortcut.ctrl) mods.push("ctrl")

    hotkeys.push([[...mods, shortcut.children].join("+"), onSelect])
  }

  useHotkeys(hotkeys, [], true)

  const { execute, isPending } = useAction(searchItems, {
    onSuccess: ({ data }) => {
      setResults(data)

      const q = query.toLowerCase().trim()

      if (q.length > 1) {
        posthog.capture("search", { query: q })
      }
    },

    onError: ({ error }) => {
      console.error(error)
      setResults(undefined)
    },
  })

  useEffect(() => {
    const performSearch = async () => {
      if (hasQuery) {
        execute({ query })
        listRef.current?.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        setResults(undefined)
      }
    }

    performSearch()
  }, [query, execute])

  return (
    <CommandDialog open={search.isOpen} onOpenChange={handleOpenChange} shouldFilter={false}>
      <CommandInput
        placeholder="Type to search..."
        onValueChange={setQuery}
        className="pr-10"
        prefix={isPending && <LoaderIcon className="animate-spin" />}
        suffix={<Kbd meta>K</Kbd>}
      />

      {hasQuery && !isPending && <CommandEmpty>No results found.</CommandEmpty>}

      <CommandList ref={listRef}>
        {!hasQuery &&
          commandSections.map(({ name, items }) => (
            <CommandGroup key={name} heading={name}>
              {items.map(({ value, label, shortcut, icon, isPending, onSelect }) => (
                <CommandItem
                  key={value || label}
                  onSelect={onSelect}
                  value={value || label}
                  disabled={isPending}
                >
                  {icon}
                  <span className="flex-1 truncate">{label}</span>
                  {isPending && <LoaderIcon className="animate-spin" />}
                  {shortcut && <CommandShortcut {...shortcut} />}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}

        <SearchResults
          name="Tools"
          items={results?.tools}
          onItemSelect={navigateTo}
          getHref={({ slug }) => `${isAdminPath ? "/admin/tools" : ""}/${slug}`}
          renderItemDisplay={({ name, faviconUrl, websiteUrl }) => (
            <>
              {faviconUrl && <img src={faviconUrl} alt="" width={16} height={16} />}
              <span className="flex-1 truncate">{name}</span>
              <span className="opacity-50">{getUrlHostname(websiteUrl)}</span>
            </>
          )}
        />

        <SearchResults
          name="Categories"
          items={results?.categories}
          onItemSelect={navigateTo}
          getHref={({ slug }) => `${isAdminPath ? "/admin" : ""}/categories/${slug}`}
          renderItemDisplay={({ name }) => name}
        />

        <SearchResults
          name="Tags"
          items={results?.tags}
          onItemSelect={navigateTo}
          getHref={({ slug }) => `${isAdminPath ? "/admin" : ""}/tags/${slug}`}
          renderItemDisplay={({ name }) => name}
        />
      </CommandList>
    </CommandDialog>
  )
}
