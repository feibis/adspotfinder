"use client"

import { NextIntlClientProvider } from "next-intl"
import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"
import type { ComponentProps, PropsWithChildren } from "react"
import { PosthogPageview } from "~/components/web/posthog-pageview"
import { env } from "~/env"

if (typeof window !== "undefined") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_API_KEY, {
    ui_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    api_host: "/_proxy/posthog/ingest",
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
  })
}

type ProvidersProps = PropsWithChildren<ComponentProps<typeof NextIntlClientProvider>>

export const Providers = ({ children, ...props }: ProvidersProps) => {
  return (
    <NextIntlClientProvider {...props}>
      <PostHogProvider client={posthog}>
        <PosthogPageview />
        {children}
      </PostHogProvider>
    </NextIntlClientProvider>
  )
}
