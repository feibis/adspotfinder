import type { Tool } from "@prisma/client"
import { Link, Text } from "@react-email/components"
import { config } from "~/config"
import { isToolPublished } from "~/lib/tools"

type EmailActionNudgeProps = {
  tool: Tool
}

export const EmailActionNudge = ({ tool }: EmailActionNudgeProps) => {
  const link = `${config.site.url}/${tool.slug}`
  const badgeLabel = isToolPublished(tool) ? "Featured on" : "Coming soon on"

  return (
    <Text>
      Want to build credibility with your users? You can now{" "}
      <Link href={`${link}?dialog=embed`}>
        add a "{badgeLabel} {config.site.name}" badge
      </Link>{" "}
      to your website, showing visitors that {tool.name} is recognized by our community.
      {!tool.ownerId && (
        <>
          {" "}
          Also, don't forget to <Link href={`${link}?dialog=claim`}>claim your tool</Link> to get a{" "}
          <strong>verified badge</strong> that helps establish trust with potential users.
        </>
      )}
    </Text>
  )
}
