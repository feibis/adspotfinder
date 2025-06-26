import type { AdType } from "@prisma/client"
import { siteConfig } from "~/config/site"
import type { AdOne } from "~/server/web/ads/payloads"

export type AdSpot = {
  label: string
  type: AdType
  description: string
  price: number
  preview?: string
}

export const adsConfig = {
  // Determines if ads are enabled
  enabled: true,

  // Maximum discount percentage for ads
  maxDiscount: 30,

  // Ad spots available for purchase
  adSpots: [
    {
      label: "Listing Ad",
      type: "Tools",
      description: "Visible on the every tool listing page",
      price: 15,
      preview: "https://share.cleanshot.com/7CFqSw0b",
    },
    {
      label: "Banner Ad",
      type: "Banner",
      description: "Visible on every page of the website",
      price: 25,
      preview: "https://share.cleanshot.com/SvqTztKT",
    },
    {
      label: "Tool Sidebar Ad",
      type: "ToolPage",
      description: "Visible on the sidebar of every tool page",
      price: 15,
      preview: "https://share.cleanshot.com/dXDbZPFv",
    },
  ] satisfies AdSpot[],

  // Default ad configuration
  defaultAd: {
    type: "All",
    websiteUrl: "/advertise",
    name: "Your brand here",
    description: "Reach our audience of professional directory owners and boost your sales.",
    buttonLabel: `Advertise on ${siteConfig.name}`,
    faviconUrl: "/favicon.png",
  } satisfies AdOne,
}
