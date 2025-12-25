"use client"

import { useTranslations } from "next-intl"
import type { ComponentProps } from "react"
import { Link } from "~/components/common/link"
import { Skeleton } from "~/components/common/skeleton"
import { Tile, TileCaption, TileDivider, TileTitle } from "~/components/web/ui/tile"
import type { LocationMany } from "~/server/web/locations/payloads"

type LocationCardProps = ComponentProps<typeof Tile> & {
  location: LocationMany
}

const LocationCard = ({ location, ...props }: LocationCardProps) => {
  const t = useTranslations()
  const count = location._count.tools

  return (
    <Tile asChild {...props}>
      <Link href={`/locations/${location.slug}`}>
        <TileTitle>
          {location.flag && <span className="mr-2">{location.flag}</span>}
          {location.displayName || location.name}
        </TileTitle>

        <TileDivider />

        <TileCaption>{`${count} ${t("tools.count_tools", { count })}`}</TileCaption>
      </Link>
    </Tile>
  )
}

const LocationCardSkeleton = () => {
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

export { LocationCard, LocationCardSkeleton }
