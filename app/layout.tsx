import "./styles.css"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import type { PropsWithChildren } from "react"
import { Search } from "~/components/common/search"
import { Toaster } from "~/components/common/toaster"
import { TooltipProvider } from "~/components/common/tooltip"
import { config } from "~/config"
import { SearchProvider } from "~/contexts/search-context"
import { fontSans } from "~/lib/fonts"

export const metadata: Metadata = {
  metadataBase: new URL(config.site.url),
  title: {
    template: `%s – ${config.site.name}`,
    default: `${config.site.tagline} – ${config.site.name}`,
  },
  description: config.site.description,
  icons: {
    icon: [{ type: "image/png", url: "/favicon.png" }],
  },
  ...config.metadata,
}

export default function RootLayout({ children }: PropsWithChildren) {
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
