import { formatDate } from "@primoui/utils"
import { ClockIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { Button } from "~/components/common/button"
import { Card } from "~/components/common/card"
import { H5 } from "~/components/common/heading"
import { Link } from "~/components/common/link"
import { Note } from "~/components/common/note"
import { isToolPublished } from "~/lib/tools"
import { cx } from "~/lib/utils"
import type { ToolOne } from "~/server/web/tools/payloads"

type ToolPreviewAlertProps = ComponentProps<typeof Card> & {
  tool: ToolOne
}

export const ToolPreviewAlert = ({ className, tool, ...props }: ToolPreviewAlertProps) => {
  if (isToolPublished(tool)) return null

  return (
    <Card
      hover={false}
      focus={false}
      className={cx("bg-yellow-500/10 border-foreground/10", className)}
      {...props}
    >
      <H5>
        This is a preview only.{" "}
        {tool.publishedAt && `${tool.name} will be published on ${formatDate(tool.publishedAt)}`}
      </H5>

      <Note className="-mt-2">
        {tool.name} is not yet published and is only visible on this page. If you want to speed up
        the process, you can expedite the review below.
      </Note>

      <Button variant="fancy" prefix={<ClockIcon />} asChild>
        <Link href={`/submit/${tool.slug}`}>Publish within 24h</Link>
      </Button>
    </Card>
  )
}
