import { ReportType } from "@prisma/client"
import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server"
import { z } from "zod/v4"
import { config } from "~/config"

export const filterParamsSchema = {
  q: parseAsString.withDefault(""),
  sort: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(config.ads.enabled ? 35 : 36),
  category: parseAsString.withDefault(""),
}

export const filterParamsCache = createSearchParamsCache(filterParamsSchema)
export type FilterSchema = Awaited<ReturnType<typeof filterParamsCache.parse>>

export const submitToolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  websiteUrl: z.url("Invalid URL").min(1, "Website is required").trim(),
  submitterName: z.string().min(1, "Your name is required"),
  submitterEmail: z.email("Please enter a valid email address"),
  submitterNote: z.string().max(200),
  newsletterOptIn: z.boolean().optional().default(true),
})

export const newsletterSchema = z.object({
  captcha: z.literal("").optional(),
  value: z.email("Please enter a valid email address"),
  unsubscribed: z.boolean().default(false),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

export const reportSchema = z.object({
  type: z.enum(ReportType),
  message: z.string().optional(),
})

export const reportToolSchema = reportSchema.extend({
  toolSlug: z.string(),
})

export const claimToolEmailSchema = z.object({
  toolSlug: z.string(),
  email: z.email("Please enter a valid email address"),
})

export const claimToolOtpSchema = z.object({
  toolSlug: z.string(),
  otp: z.string().min(6, "Please enter a valid OTP code"),
})

export const adDetailsSchema = z.object({
  sessionId: z.string(),
  name: z.string().min(1, "Company name is required"),
  description: z.string().min(1, "Description is required").max(160),
  websiteUrl: z.url("Please enter a valid website URL"),
  buttonLabel: z.string().optional(),
})
