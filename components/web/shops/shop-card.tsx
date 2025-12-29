"use client"

import { useTranslations } from "next-intl"
import type { ComponentProps } from "react"
import { Link } from "~/components/common/link"
import { Skeleton } from "~/components/common/skeleton"
import { Tile, TileCaption, TileDivider, TileTitle } from "~/components/web/ui/tile"
import type { ShopMany } from "~/server/web/shops/payloads"

type ShopCardProps = ComponentProps<typeof Tile> & {
  shop: ShopMany
}

const ShopCard = ({ shop, ...props }: ShopCardProps) => {
  const t = useTranslations()
  const count = shop._count.tools

  return (
    <Tile asChild {...props}>
      <Link href={`/shops/${shop.slug}`}>
        <TileTitle>{shop.slug}</TileTitle>

        <TileDivider />

        <TileCaption>{`${count} ${t("tools.count_tools", { count })}`}</TileCaption>
      </Link>
    </Tile>
  )
}

const ShopCardSkeleton = () => {
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

export { ShopCard, ShopCardSkeleton }
