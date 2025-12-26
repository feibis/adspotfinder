"use client"

import { useTranslations } from "next-intl"
import type { ComponentProps } from "react"
import { Link } from "~/components/common/link"
import { Skeleton } from "~/components/common/skeleton"
import { Badge } from "~/components/common/badge"
import { Tile, TileCaption, TileDivider, TileTitle } from "~/components/web/ui/tile"
import type { AttributeMany } from "~/server/web/attributes/payloads"

type AttributeCardProps = ComponentProps<typeof Tile> & {
  attribute: AttributeMany
}

const AttributeCard = ({ attribute, ...props }: AttributeCardProps) => {
  const t = useTranslations()
  const count = attribute._count.tools

  return (
    <Tile asChild {...props}>
      <Link href={`/attributes/${attribute.slug}`}>
        <TileTitle className="flex items-center gap-2">
          {attribute.name}
          {attribute.group && (
            <Badge variant="soft" className="text-xs">
              {attribute.group.name}
            </Badge>
          )}
        </TileTitle>

        <TileDivider />

        <TileCaption>{`${count} ${t("tools.count_tools", { count })}`}</TileCaption>
      </Link>
    </Tile>
  )
}

const AttributeCardSkeleton = () => {
  return (
    <Tile>
      <TileTitle className="w-1/2">
        <Skeleton>&nbsp;</Skeleton>
      </TileTitle>

      <Skeleton className="h-0.5 flex-1" />

      <TileCaption className="w-1/4">
        <Skeleton>&nbsp;</Skeleton>
      </TileCaption>
    </Tile>
  )
}

export { AttributeCard, AttributeCardSkeleton }

