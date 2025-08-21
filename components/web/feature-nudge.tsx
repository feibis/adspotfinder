import type { Tool } from "@prisma/client"
import { toast } from "sonner"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { siteConfig } from "~/config/site"

type FeatureNudgeProps = {
  tool: Tool
  t: string | number
}

export const FeatureNudge = ({ tool, t }: FeatureNudgeProps) => {
  return (
    <>
      <p className="text-sm text-secondary-foreground">
        <strong>{tool.name}</strong> has already been published on {siteConfig.name}. If you want,
        you can feature it for extra exposure.
      </p>

      <Stack size="sm" className="w-full mt-4">
        <Button size="md" className="flex-1" onClick={() => toast.dismiss(t)} asChild>
          <Link href={`/submit/${tool.slug}`}>Feature {tool.name}</Link>
        </Button>

        <Button size="md" variant="secondary" onClick={() => toast.dismiss(t)}>
          Dismiss
        </Button>
      </Stack>
    </>
  )
}
