import { eachDayOfInterval, format, startOfDay, subDays } from "date-fns"
import { env } from "~/env"
import { getPlausibleApi } from "~/services/plausible"
import { tryCatch } from "~/utils/helpers"

type AnalyticsPageResponse = {
  results: { metrics: [number, number]; dimensions: [] }[]
}

/**
 * Get the page analytics for a given page and period
 * @param page - The page to get the analytics for
 * @param period - The period to get the analytics for
 * @returns The page analytics
 */
export const getPageAnalytics = async (page: string, period = "30d") => {
  const query = {
    site_id: env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    metrics: ["visitors", "pageviews"],
    date_range: period,
    filters: [["is", "event:page", [page]]],
  }

  const { data, error } = await tryCatch(
    getPlausibleApi().post(query).json<AnalyticsPageResponse>(),
  )

  if (error) {
    console.error("Analytics error:", error)
    return { visitors: 0, pageviews: 0 }
  }

  return {
    visitors: data.results[0].metrics[0],
    pageviews: data.results[0].metrics[1],
  }
}

type AnalyticsTotalResponse = {
  results: { metrics: [number]; dimensions: [string] }[]
}

/**
 * Get the total analytics for a given period
 * @param period - The period to get the analytics for
 * @returns The total analytics
 */
export const getTotalAnalytics = async (period = "30d") => {
  const query = {
    site_id: env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    metrics: ["visitors"],
    date_range: period,
    dimensions: ["time:day"],
  }

  const { data, error } = await tryCatch(
    getPlausibleApi().post(query).json<AnalyticsTotalResponse>(),
  )

  if (error) {
    console.error("Analytics error:", error)
    return { results: [], totalVisitors: 0, averageVisitors: 0 }
  }

  // Group visitors by date
  const visitorsByDate = data.results.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.dimensions[0]] = curr.metrics[0]
    return acc
  }, {})

  // Fill in missing dates with 0
  const results = eachDayOfInterval({
    start: startOfDay(subDays(new Date(), 30)),
    end: new Date(),
  }).map(day => ({
    date: format(day, "yyyy-MM-dd"),
    value: visitorsByDate[format(day, "yyyy-MM-dd")] || 0,
  }))

  const totalVisitors = results.reduce((acc, curr) => acc + curr.value, 0)
  const averageVisitors = totalVisitors / results.length

  return { results, totalVisitors, averageVisitors }
}
