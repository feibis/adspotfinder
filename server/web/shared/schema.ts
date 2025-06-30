import { z } from "zod/v4"

export const VALID_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export const fileSchema = z
  .instanceof(File)
  .refine(async ({ size }) => size > 0, "File cannot be empty")
  .refine(async ({ size }) => size < 1024 * 512, "File size must be less than 512KB")
  .refine(async ({ type }) => VALID_IMAGE_TYPES.includes(type), "File must be a valid image")

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

export const reportToolSchema = z.object({
  type: z.string().min(1, "Type is required"),
  email: z.email("Please enter a valid email address"),
  message: z.string().optional(),
  toolId: z.string(),
})

export const feedbackSchema = z.object({
  email: z.email("Please enter a valid email address"),
  message: z.string().min(1, "Message is required"),
})

export const claimToolEmailSchema = z.object({
  toolId: z.string(),
  email: z.email("Please enter a valid email address"),
})

export const claimToolOtpSchema = z.object({
  toolId: z.string(),
  otp: z.string().min(6, "Please enter a valid OTP code"),
})

export const adDetailsSchema = z.object({
  sessionId: z.string(),
  name: z.string().min(1, "Company name is required"),
  description: z.string().min(1, "Description is required").max(160),
  websiteUrl: z.url("Please enter a valid website URL"),
  buttonLabel: z.string().optional(),
})
