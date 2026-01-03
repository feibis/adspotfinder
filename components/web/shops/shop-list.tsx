"use client"

import { useTranslations } from "next-intl"
import type { ComponentProps } from "react"
import { EmptyList } from "~/components/web/empty-list"
import { AgencyCard, AgencyCardSkeleton } from "~/components/web/agencys/agency-card"
import { Grid } from "~/components/web/ui/grid"
import { cx } from "~/lib/utils"
import type { AgencyMany } from "~/server/web/agencys/payloads"

type AgencyListProps = ComponentProps<typeof Grid> & {
  agencys: AgencyMany[]
}

const AgencyList = ({ agencys, className, ...props }: AgencyListProps) => {
  const t = useTranslations()

  return (
    <Grid className={cx("gap-x-8", className)} {...props}>
      {agencys.map(agency => (
        <AgencyCard key={agency.slug} agency={agency} />
      ))}

      {!agencys.length && <EmptyList>{t("agencys.no_agencys")}</EmptyList>}
    </Grid>
  )
}

const AgencyListSkeleton = () => {
  return (
    <Grid className="gap-x-8">
      {[...Array(24)].map((_, index) => (
        <AgencyCardSkeleton key={index} />
      ))}
    </Grid>
  )
}

export { AgencyList, AgencyListSkeleton, type AgencyListProps }
