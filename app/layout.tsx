import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Search } from "~/components/common/search"
import { Toaster } from "~/components/common/toaster"
import { TooltipProvider } from "~/components/common/tooltip"
import { metadataConfig } from "~/config/metadata"
import { siteConfig } from "~/config/site"
import { SearchProvider } from "~/contexts/search-context"
import { fontSans } from "~/lib/fonts"
import "./styles.css"

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    template: `%s – ${siteConfig.name}`,
    default: `${siteConfig.tagline} – ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: [{ type: "image/png", url: "/favicon.png" }],
  },
  ...metadataConfig,
}

export default function ({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col bg-background text-foreground font-sans">
        <NuqsAdapter>
          <TooltipProvider delayDuration={250}>
            <SearchProvider>
              <ThemeProvider attribute="class" disableTransitionOnChange>
                {children}
                <Toaster />
                <Search />
              </ThemeProvider>
            </SearchProvider>
          </TooltipProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
