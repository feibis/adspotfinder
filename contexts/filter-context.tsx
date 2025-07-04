"use client"

import { useQueryStates, type Values } from "nuqs"
import { createContext, type PropsWithChildren, use, useTransition } from "react"
import { isDefaultState } from "~/lib/parsers"
import { filterParamsSchema } from "~/server/web/shared/schema"

export type FiltersContextType = {
  filters: Values<typeof filterParamsSchema>
  isLoading: boolean
  isDefault: boolean
  enableSort: boolean
  enableFilters: boolean
  updateFilters: (values: Partial<Values<typeof filterParamsSchema>> | null) => void
}

const FiltersContext = createContext<FiltersContextType>(null!)

export type FiltersProviderProps = {
  enableSort?: boolean
  enableFilters?: boolean
}

const FiltersProvider = ({
  children,
  enableSort = true,
  enableFilters = false,
}: PropsWithChildren<FiltersProviderProps>) => {
  const [isLoading, startTransition] = useTransition()

  const [filters, setFilters] = useQueryStates(filterParamsSchema, {
    shallow: false,
    history: "push",
    startTransition,
    limitUrlUpdates: {
      method: "debounce",
      timeMs: 250,
    },
  })

  const isDefault = isDefaultState(filterParamsSchema, filters, ["page", "perPage"])

  const updateFilters = (values: Partial<Values<typeof filterParamsSchema>> | null) => {
    if (values === null) {
      setFilters(null)
    } else {
      setFilters(prev => ({ ...prev, ...values, page: null }))
    }
  }

  return (
    <FiltersContext.Provider
      value={{ filters, isLoading, isDefault, updateFilters, enableSort, enableFilters }}
    >
      {children}
    </FiltersContext.Provider>
  )
}

const useFilters = () => {
  const context = use(FiltersContext)

  if (context === undefined) {
    throw new Error("useFilters must be used within a FiltersProvider")
  }

  return context
}

export { FiltersProvider, useFilters }
