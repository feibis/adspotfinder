import { Text } from "@react-email/components"
import type { Tool } from "~/.generated/prisma/client"
import { EmailExpediteNudge } from "~/emails/components/expedite-nudge"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/components/wrapper"
import { calculateQueueDuration } from "~/lib/products"

export type EmailProps = EmailWrapperProps & {
  tool: Tool
  queue?: number
}

const EmailSubmission = ({ tool, queue = 100, ...props }: EmailProps) => {
  return (
    <EmailWrapper {...props}>
      <Text>Hey {tool.submitterName?.trim()}!</Text>

      <Text>Thanks for submitting {tool.name}, it'll be reviewed shortly!</Text>

      {queue > 10 && (
        <EmailExpediteNudge tool={tool}>
          in approximately <strong>{calculateQueueDuration(queue)}</strong>
        </EmailExpediteNudge>
      )}
    </EmailWrapper>
  )
}

export default EmailSubmission
