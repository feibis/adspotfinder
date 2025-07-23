import { type Tool, ToolStatus } from "@prisma/client"
import { differenceInDays } from "date-fns"
import { config } from "~/config"

/**
 * Check if a tool is published.
 *
 * @param tool - The tool to check.
 * @returns Whether the tool is published.
 */
export const isToolPublished = (tool: Pick<Tool, "status">) => {
  return tool.status === ToolStatus.Published
}

/**
 * Check if a tool is within the expedite threshold.
 *
 * @param tool - The tool to check.
 * @returns Whether the tool is within the expedite threshold.
 */
export const isToolWithinExpediteThreshold = (tool: Pick<Tool, "publishedAt">) => {
  const threshold = config.submissions.expediteThreshold

  return tool.publishedAt && differenceInDays(tool.publishedAt, new Date()) < threshold
}
