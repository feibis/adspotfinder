"use client"

import { BadgeCheckIcon, CodeXmlIcon, FlagIcon, SparklesIcon } from "lucide-react"
import { parseAsStringEnum, useQueryState } from "nuqs"
import type { ComponentProps, SetStateAction } from "react"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import { ToolClaimDialog } from "~/components/web/dialogs/tool-claim-dialog"
import { ToolEmbedDialog } from "~/components/web/dialogs/tool-embed-dialog"
import { ToolReportDialog } from "~/components/web/dialogs/tool-report-dialog"
import { reportsConfig } from "~/config/reports"
import { useSession } from "~/lib/auth-client"
import { isToolPublished } from "~/lib/tools"
import { cx } from "~/lib/utils"
import type { ToolOne } from "~/server/web/tools/payloads"

type ToolActionsProps = ComponentProps<typeof Stack> & {
  tool: ToolOne
}

enum Dialog {
  report = "report",
  embed = "embed",
  claim = "claim",
}

export const ToolActions = ({ tool, children, className, ...props }: ToolActionsProps) => {
  const { data: session } = useSession()
  const [dialog, setDialog] = useQueryState("dialog", parseAsStringEnum(Object.values(Dialog)))

  const handleClose = (isOpen: SetStateAction<boolean>) => {
    !isOpen && setDialog(null)
  }

  return (
    <Stack size="sm" wrap={false} className={cx("justify-end", className)} {...props}>
      {!tool.isFeatured && tool.ownerId && tool.ownerId === session?.user.id && (
        <Tooltip tooltip="Promote this tool to get more visibility">
          <Button
            size="md"
            variant="secondary"
            prefix={<SparklesIcon className="text-inherit" />}
            className="text-blue-600 dark:text-blue-400"
            asChild
          >
            <Link href={`/submit/${tool.slug}`}>Promote</Link>
          </Button>
        </Tooltip>
      )}

      {!tool.ownerId && (
        <Tooltip tooltip="Claim this tool to get a verified badge">
          <Button
            size="md"
            variant="secondary"
            prefix={<BadgeCheckIcon className="text-inherit" />}
            onClick={() => setDialog(Dialog.claim)}
            className="text-blue-600 dark:text-blue-400"
          >
            Claim
          </Button>
        </Tooltip>
      )}

      {reportsConfig.enabled && (
        <Tooltip tooltip="Send a report/suggestion">
          <Button
            size="md"
            variant="secondary"
            prefix={<FlagIcon />}
            onClick={() => setDialog(Dialog.report)}
            aria-label="Report"
          />
        </Tooltip>
      )}

      {isToolPublished(tool) && (
        <Tooltip tooltip="Embed this tool on your website">
          <Button
            size="md"
            variant="secondary"
            prefix={<CodeXmlIcon />}
            onClick={() => setDialog(Dialog.embed)}
            aria-label="Embed"
          />
        </Tooltip>
      )}

      {children}

      {reportsConfig.enabled && (
        <ToolReportDialog tool={tool} isOpen={dialog === Dialog.report} setIsOpen={handleClose} />
      )}

      {isToolPublished(tool) && (
        <ToolEmbedDialog tool={tool} isOpen={dialog === Dialog.embed} setIsOpen={handleClose} />
      )}

      {!tool.ownerId && (
        <ToolClaimDialog tool={tool} isOpen={dialog === Dialog.claim} setIsOpen={handleClose} />
      )}
    </Stack>
  )
}
