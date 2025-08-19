import type { Tool } from "@prisma/client"
import { Text } from "@react-email/components"
import { config } from "~/config"
import { EmailActionNudge } from "~/emails/components/action-nudge"
import { EmailButton } from "~/emails/components/button"
import { EmailFeatureNudge } from "~/emails/components/feature-nudge"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/components/wrapper"

export type EmailProps = EmailWrapperProps & {
  tool: Tool
}

const EmailSubmissionPublished = ({ tool, ...props }: EmailProps) => {
  const toolUrl = `${config.site.url}/${tool.slug}`

  return (
    <EmailWrapper {...props}>
      <Text>Hey {tool.submitterName?.trim()}!</Text>

      <Text>
        Great news! Your submitted tool, <strong>{tool.name}</strong>, is now{" "}
        <strong>live on {config.site.name}</strong>. Thank you for sharing this awesome resource
        with our community!
      </Text>

      <Text>
        We'd love it if you could spread the word. A quick post on your favorite social platform or
        community about {tool.name} would mean a lot to us. It helps other people discover cool
        tools like yours!
      </Text>

      <EmailButton href={toolUrl}>
        Check out {tool.name} on {config.site.name}
      </EmailButton>

      <EmailActionNudge tool={tool} />
      <EmailFeatureNudge tool={tool} />
    </EmailWrapper>
  )
}

export default EmailSubmissionPublished
