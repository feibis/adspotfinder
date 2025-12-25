import { type Prisma, ToolStatus } from "~/.generated/prisma/client"

export const locationOnePayload = {
  name: true,
  slug: true,
  country: true,
  countryCode: true,
  displayName: true,
  flag: true,
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
} satisfies Prisma.LocationSelect

export const locationManyPayload = {
  name: true,
  slug: true,
  country: true,
  countryCode: true,
  displayName: true,
  flag: true,
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
} satisfies Prisma.LocationSelect

export type LocationOne = Prisma.LocationGetPayload<{ select: typeof locationOnePayload }>
export type LocationMany = Prisma.LocationGetPayload<{ select: typeof locationManyPayload }>
