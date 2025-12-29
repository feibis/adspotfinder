import type { ToolOne } from "~/server/web/tools/payloads"
import { Badge } from "~/components/common/badge"
import { Stack } from "~/components/common/stack"

type ToolPricingProps = {
  tool: ToolOne
}

export function ToolPricing({ tool }: ToolPricingProps) {
  if (!tool.pricings || tool.pricings.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {tool.pricings.map((pricing) => (
        <div key={pricing.id} className="border rounded-lg p-4">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold">
              {pricing.currency} {Number(pricing.price).toFixed(2)}
            </span>
            <span className="text-muted-foreground">
              /{pricing.period}
              {pricing.unit && ` ${pricing.unit}`}
            </span>
          </div>

          {pricing.name && (
            <div className="font-medium mb-2">{pricing.name}</div>
          )}

          {pricing.attributes && pricing.attributes.length > 0 && (
            <Stack direction="row" className="flex-wrap gap-2">
              {pricing.attributes.map((attr) => (
                <Badge key={attr.id} variant="soft" size="sm">
                  {attr.group.name}: {attr.name}
                </Badge>
              ))}
            </Stack>
          )}
        </div>
      ))}
    </div>
  )
}

