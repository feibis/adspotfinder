import { withContentCollections } from "@content-collections/next"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactStrictMode: false,

  experimental: {
    useCache: true,
    turbopackFileSystemCacheForDev: true,

    cacheLife: {
      infinite: {
        stale: Number.POSITIVE_INFINITY,
        revalidate: Number.POSITIVE_INFINITY,
        expire: Number.POSITIVE_INFINITY,
      },
    },

    optimizePackageImports: [
      "@content-collections/core",
      "@content-collections/mdx",
      "@content-collections/next",
    ],
  },

  async rewrites() {
    const posthogUrl = process.env.NEXT_PUBLIC_POSTHOG_HOST

    return [
      // PostHog proxy
      {
        source: "/_proxy/posthog/ingest/static/:path*",
        destination: `${posthogUrl?.replace("us", "us-assets")}/static/:path*`,
      },
      {
        source: "/_proxy/posthog/ingest/:path*",
        destination: `${posthogUrl}/:path*`,
      },
      {
        source: "/_proxy/posthog/ingest/decide",
        destination: `${posthogUrl}/decide`,
      },
    ]
  },
}

export default withContentCollections(nextConfig)
