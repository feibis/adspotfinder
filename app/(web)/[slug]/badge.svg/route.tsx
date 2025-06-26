import { notFound } from "next/navigation"
import type { NextRequest } from "next/server"
import { createSearchParamsCache, parseAsInteger, parseAsStringEnum } from "nuqs/server"
import satori from "satori"
import { LogoSymbol } from "~/components/web/ui/logo-symbol"
import { siteConfig } from "~/config/site"
import { loadGoogleFont } from "~/lib/fonts"
import { findTool } from "~/server/web/tools/queries"

const THEMES = {
  light: {
    background: "hsl(0 0% 100%)",
    border: "hsl(0 0% 83%)",
    text: "hsl(0 0% 12%)",
    logo: "hsl(234, 98%, 61%)",
  },
  dark: {
    background: "hsl(0 0% 5%)",
    border: "hsl(0 0% 20%)",
    text: "hsl(0 0% 90%)",
    logo: "hsl(0 0% 90%)",
  },
  neutral: {
    background: "hsl(0 0% 80%)",
    border: "hsl(0 0% 12%)",
    text: "hsl(0 0% 12%)",
    logo: "hsl(0 0% 12%)",
  },
} as const

const SvgBadge = ({ theme }: { theme: keyof typeof THEMES }) => {
  const colors = THEMES[theme]

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: "0.75em",
        display: "flex",
        alignItems: "center",
        gap: "0.8em",
        paddingLeft: "0.8em",
        paddingRight: "0.8em",
        color: colors.text,
        fontFamily: "Geist",
        overflow: "hidden",
      }}
    >
      <LogoSymbol
        style={{
          height: "1.25em",
          width: "1.25em",
          color: colors.logo,
          flexShrink: 0,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <span
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            lineHeight: 1,
            opacity: 0.75,
          }}
        >
          Featured on
        </span>

        <span
          style={{
            fontSize: 16,
            fontFamily: "GeistBold",
            lineHeight: 1.2,
            letterSpacing: "-0.025em",
            whiteSpace: "nowrap",
          }}
        >
          {siteConfig.name}
        </span>
      </div>

      <LogoSymbol
        style={{
          height: "4.8em",
          width: "4.8em",
          position: "absolute",
          top: "50%",
          right: "-1em",
          transform: "translateY(-50%) rotate(12deg)",
          marginTop: "0.5em",
          color: colors.logo,
          opacity: theme === "dark" ? 0.1 : 0.05,
        }}
      />
    </div>
  )
}

type PageProps = {
  params: Promise<{ slug: string }>
}

const searchParamsCache = createSearchParamsCache({
  theme: parseAsStringEnum(["light", "dark", "neutral"]).withDefault("light"),
  width: parseAsInteger.withDefault(200),
  height: parseAsInteger.withDefault(50),
})

export const GET = async ({ nextUrl }: NextRequest, { params }: PageProps) => {
  const searchParams = Object.fromEntries(nextUrl.searchParams.entries())

  const { slug } = await params
  const { theme, width, height } = searchParamsCache.parse(searchParams)

  const tool = await findTool({ where: { slug } })
  if (!tool) notFound()

  const svg = await satori(<SvgBadge theme={theme} />, {
    width,
    height,
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

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
