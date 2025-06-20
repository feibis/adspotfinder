const excludePaths = ["/admin*", "/auth*", "/dashboard*", "/*/opengraph-image-"]

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000",
  exclude: excludePaths,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: excludePaths,
      },
    ],
  },
}
