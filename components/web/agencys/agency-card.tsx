"use client"

import { useTranslations } from "next-intl"
import type { ComponentProps } from "react"
import { Link } from "~/components/common/link"
import { Skeleton } from "~/components/common/skeleton"
import { Tile, TileCaption, TileDivider, TileTitle } from "~/components/web/ui/tile"
import type { AgencyMany } from "~/server/web/agencys/payloads"

type AgencyCardProps = ComponentProps<typeof Tile> & {
  agency: AgencyMany
}

const AgencyCard = ({ agency, ...props }: AgencyCardProps) => {
  const t = useTranslations()
  const count = agency._count.locations

  return (
    <Tile asChild {...props}>
      <Link href={`/agencys/${agency.slug}`}>
        <TileTitle>{agency.slug}</TileTitle>

        <TileDivider />

        <TileCaption>{`${count} ${t("agencys.count_locations", { count })}`}</TileCaption>
      </Link>
    </Tile>
  )
}

const AgencyCardSkeleton = () => {
  return (
    <Tile>
      <TileTitle className="w-1/3">
        <Skeleton>&nbsp;</Skeleton>
      </TileTitle>

      <Skeleton className="h-0.5 flex-1" />

      <TileCaption className="w-1/4">
        <Skeleton>&nbsp;</Skeleton>
      </TileCaption>
    </Tile>
  )
}

export { AgencyCard, AgencyCardSkeleton }
