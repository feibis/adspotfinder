import { ComponentProps, ReactNode } from "react"
import { CardDescription, CardHeader } from "~/components/common/card"
import { H2 } from "~/components/common/heading"

type StatCardHeaderProps = ComponentProps<typeof CardHeader> & {
  title: ReactNode
  value: ReactNode
  note?: ReactNode
}

export const StatCardHeader = ({ title, value, note }: StatCardHeaderProps) => {
  return (
    <CardHeader>
      <CardDescription>{title}</CardDescription>
      {note && <span className="ml-auto text-xs text-muted-foreground/50">{note}</span>}
      <H2 className="w-full">{value}</H2>
    </CardHeader>
  )
}
