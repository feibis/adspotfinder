"use client"

import { useTranslations } from "next-intl"
import type { ComponentProps } from "react"
import { AttributeCard, AttributeCardSkeleton } from "~/components/web/attributes/attribute-card"
import { EmptyList } from "~/components/web/empty-list"
import { Grid } from "~/components/web/ui/grid"
import { cx } from "~/lib/utils"
import type { AttributeMany } from "~/server/web/attributes/payloads"

type AttributeListProps = ComponentProps<typeof Grid> & {
  attributes: AttributeMany[]
}

const AttributeList = ({ attributes, className, ...props }: AttributeListProps) => {
  const t = useTranslations()

  return (
    <Grid className={cx("gap-x-8", className)} {...props}>
      {attributes.map(attribute => (
        <AttributeCard key={attribute.slug} attribute={attribute} />
      ))}

      {!attributes.length && <EmptyList>{t("attributes.no_attributes")}</EmptyList>}
    </Grid>
  )
}

const AttributeListSkeleton = () => {
  return (
    <Grid className="gap-x-8">
      {[...Array(24)].map((_, index) => (
        <AttributeCardSkeleton key={index} />
      ))}
    </Grid>
  )
}

export { AttributeList, AttributeListSkeleton, type AttributeListProps }

