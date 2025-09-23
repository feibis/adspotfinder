import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"
import { createLoader } from "nuqs/server"
import { OgBase } from "~/components/web/og/og-base"
import { loadGoogleFont } from "~/lib/fonts"
import { openGraphSearchParams } from "~/lib/opengraph"

export const contentType = "image/png"
export const alt = "OpenGraph Image"
export const size = { width: 1200, height: 630 }

export const GET = async (req: NextRequest) => {
  const loadSearchParams = createLoader(openGraphSearchParams)
  const params = loadSearchParams(req)

  return new ImageResponse(<OgBase {...params} />, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Geist",
        data: await loadGoogleFont("Geist", 400),
        weight: 400,
        style: "normal",
      },
      {
        name: "GeistBold",
        data: await loadGoogleFont("Geist", 600),
        weight: 600,
        style: "normal",
      },
    ],
  })
}
