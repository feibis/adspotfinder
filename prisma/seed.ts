import { addDays } from "date-fns"
import { ToolStatus } from "~/.generated/prisma/client"
import { db } from "~/services/db"

const ADMIN_EMAIL = "admin@adspotfinder.com"
const USER_EMAIL = "user@adspotfinder.com"

const DUMMY_CONTENT = `This platform offers excellent advertising opportunities for startups, SaaS products, and indie makers. With a **highly engaged audience** of founders, developers, and entrepreneurs, it provides targeted exposure that drives meaningful traffic and conversions. Whether you're launching a new product or scaling an existing one, advertising here connects you directly with decision-makers and early adopters.

The site features **flexible ad formats** including sidebar banners, newsletter sponsorships, dedicated spots, and featured listings. Many platforms in this space have high Domain Authority (DA 50+), strong organic traffic, and a focused niche audience interested in tools, products, and services. Sponsorships often include detailed analytics, allowing you to track clicks, sign-ups, and ROI effectively.

Getting started is simple—most sites have clear media kits with pricing, audience demographics, and past performance data. The community values authentic promotions, leading to higher engagement rates compared to general advertising channels. Regular sponsorships can build brand recognition and foster long-term partnerships within the ecosystem.`

async function main() {
  const now = new Date()

  console.log("Starting seeding...")

  await db.user.createMany({
    data: [
      {
        name: "Admin User",
        email: ADMIN_EMAIL,
        emailVerified: true,
        role: "admin",
      },
      {
        name: "User",
        email: USER_EMAIL,
        emailVerified: true,
        role: "user",
      },
    ],
  })

  console.log("Created users")

  // Create categories
  await db.category.createMany({
    data: [
      {
        name: "Launch Platforms",
        slug: "launch-platforms",
        label: "Product Launch Platforms",
        description: "Platforms for launching products with paid promotion and featured options.",
      },
      {
        name: "Newsletters",
        slug: "newsletters",
        label: "Indie & Tech Newsletters",
        description: "Popular newsletters offering sponsorship slots to reach targeted audiences.",
      },
      {
        name: "Directories",
        slug: "directories",
        label: "Startup & SaaS Directories",
        description: "Directories with paid featured listings and sponsorships.",
      },
      {
        name: "Communities",
        slug: "communities",
        label: "Maker Communities",
        description: "Communities and forums with advertising opportunities.",
      },
      {
        name: "Marketplaces",
        slug: "marketplaces",
        label: "Sponsorship Marketplaces",
        description: "Platforms connecting advertisers with ad spots across sites and newsletters.",
      },
      {
        name: "Review Sites",
        slug: "review-sites",
        label: "Review & Comparison Sites",
        description: "Sites like G2/Capterra with sponsored listings for SaaS.",
      },
    ],
  })

  console.log("Created categories")

  // Create tags
  await db.tag.createMany({
    data: [
      { name: "Sponsorships", slug: "sponsorships" },
      { name: "Newsletter Ads", slug: "newsletter-ads" },
      { name: "High DA", slug: "high-da" },
      { name: "Indie Makers", slug: "indie-makers" },
      { name: "Startups", slug: "startups" },
      { name: "SaaS", slug: "saas" },
      { name: "Product Launch", slug: "product-launch" },
      { name: "Featured Listing", slug: "featured-listing" },
      { name: "Banner Ads", slug: "banner-ads" },
      { name: "Paid Promotion", slug: "paid-promotion" },
    ],
  })

  console.log("Created tags")

  // Exact same number and style as original (17 entries) - just adapted to ad spots
  const platformsData = [
    {
      name: "Product Hunt",
      slug: "product-hunt",
      websiteUrl: "https://www.producthunt.com",
      tagline: "The place to launch and discover new products",
      description:
        "Leading platform for product launches with paid promotion options for featured visibility.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://www.producthunt.com/og-image.png",
      categories: ["launch-platforms"],
      tags: ["product-launch", "high-da", "paid-promotion"],
      owner: { connect: { email: ADMIN_EMAIL } },
    },
    {
      name: "BetaList",
      slug: "betalist",
      websiteUrl: "https://betalist.com",
      tagline: "Discover and get early access to upcoming startups",
      description:
        "Early-stage startup platform with paid featured spots for exposure to early adopters.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://betalist.com/assets/og_image.png",
      categories: ["launch-platforms"],
      tags: ["paid-promotion", "startups"],
    },
    {
      name: "TLDR Newsletter",
      slug: "tldr",
      websiteUrl: "https://tldr.tech",
      tagline: "Daily tech newsletter with sponsorship slots",
      description:
        "Large developer-focused newsletter offering high-engagement sponsorships.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://tldr.tech/og-image.png",
      categories: ["newsletters"],
      tags: ["newsletter-ads", "high-da"],
    },
    {
      name: "G2",
      slug: "g2",
      websiteUrl: "https://www.g2.com",
      tagline: "Peer-to-peer software reviews with advertising",
      description:
        "Leading B2B review platform with sponsored profiles and ads.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://www.g2.com/assets/facebook-og-image.png",
      categories: ["review-sites"],
      tags: ["saas", "paid-promotion", "high-da"],
    },
    {
      name: "Indie Hackers",
      slug: "indie-hackers",
      websiteUrl: "https://www.indiehackers.com",
      tagline: "Community for indie makers building profitable businesses",
      description:
        "Active community with newsletter sponsorships and promotion opportunities.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://www.indiehackers.com/images/social.png",
      categories: ["communities"],
      tags: ["indie-makers", "high-da", "sponsorships"],
    },
    {
      name: "Capterra",
      slug: "capterra",
      websiteUrl: "https://www.capterra.com",
      tagline: "Software reviews with sponsored listings",
      description:
        "Major review site offering PPC and sponsored placements for SaaS.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://www.capterra.com/assets/social-share.png",
      categories: ["review-sites", "directories"],
      tags: ["saas", "paid-promotion", "high-da"],
    },
    {
      name: "Paved",
      slug: "paved",
      websiteUrl: "https://www.paved.com",
      tagline: "Newsletter sponsorship marketplace",
      description:
        "Platform to book newsletter ads across many publications.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://www.paved.com/assets/images/paved-og.png",
      categories: ["marketplaces"],
      tags: ["newsletter-ads", "sponsorships"],
    },
    {
      name: "Uneed",
      slug: "uneed",
      websiteUrl: "https://www.uneed.best",
      tagline: "Curated tools directory with paid boosts",
      description:
        "Product Hunt alternative with paid options for top exposure.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://www.uneed.best/opengraph-image.jpg",
      categories: ["directories"],
      tags: ["paid-promotion", "indie-makers"],
    },
    {
      name: "SaaSHub",
      slug: "saashub",
      websiteUrl: "https://www.saashub.com",
      tagline: "Independent SaaS directory with promotions",
      description:
        "Software directory offering sponsored listings and features.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://www.saashub.com/images/og.png",
      categories: ["directories"],
      tags: ["saas", "paid-promotion"],
    },
    {
      name: "AppSumo",
      slug: "appsumo",
      websiteUrl: "https://appsumo.com",
      tagline: "Lifetime deals marketplace with partnerships",
      description:
        "Popular deal site for SaaS with promotional collaboration opportunities.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://appsumo.com/static/images/og-image.jpg",
      categories: ["marketplaces"],
      tags: ["saas", "paid-promotion"],
    },
    {
      name: "AlternativeTo",
      slug: "alternativeto",
      websiteUrl: "https://alternativeto.net",
      tagline: "Crowdsourced software recommendations with ads",
      description:
        "Platform for finding alternatives with sponsorship options.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://alternativeto.net/static/img/og-image.png",
      categories: ["directories"],
      tags: ["high-da", "paid-promotion"],
    },
    {
      name: "Stuff to Sponsor",
      slug: "stuff-to-sponsor",
      websiteUrl: "https://stufftosponsor.com",
      tagline: "Curated list of sponsorship opportunities",
      description:
        "Directory of newsletters and sites open to sponsorships.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://stufftosponsor.com/og-image.png",
      categories: ["marketplaces"],
      tags: ["sponsorships", "newsletter-ads", "indie-makers"],
    },
    {
      name: "Dev.to",
      slug: "dev-to",
      websiteUrl: "https://dev.to",
      tagline: "Developer community with sponsorships",
      description:
        "Tech blogging platform with advertising and sponsorship options.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://dev.to/social_previews/article.png",
      categories: ["communities"],
      tags: ["newsletter-ads", "high-da"],
    },
    {
      name: "Hacker News",
      slug: "hacker-news",
      websiteUrl: "https://news.ycombinator.com",
      tagline: "Tech news and discussion with YC ads",
      description:
        "Influential community; paid ads available through Y Combinator.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://news.ycombinator.com/y18.gif",
      categories: ["communities"],
      tags: ["high-da", "startups"],
    },
    {
      name: "Microlaunch",
      slug: "microlaunch",
      websiteUrl: "https://microlaunch.net",
      tagline: "Month-long launch platform for indie products",
      description:
        "Alternative launch site with paid features for better ranking.",
      status: ToolStatus.Scheduled,
      publishedAt: addDays(now, 7),
      screenshotUrl: "",
      categories: ["launch-platforms"],
      tags: ["product-launch", "paid-promotion"],
      owner: { connect: { email: ADMIN_EMAIL } },
    },
    {
      name: "Launching Next",
      slug: "launching-next",
      websiteUrl: "https://www.launchingnext.com",
      tagline: "Directory of new startups and products",
      description:
        "Showcases promising startups with paid promotion options.",
      status: ToolStatus.Draft,
      screenshotUrl: "",
      categories: ["directories"],
      tags: ["startups", "paid-promotion"],
      owner: { connect: { email: ADMIN_EMAIL } },
    },
    {
      name: "OpenHunts",
      slug: "openhunts",
      websiteUrl: "https://openhunts.com",
      tagline: "Fair community-driven product launch platform",
      description:
        "Alternative to Product Hunt with affordable promotion options.",
      status: ToolStatus.Draft,
      screenshotUrl: "",
      categories: ["launch-platforms"],
      tags: ["indie-makers", "product-launch"],
      owner: { connect: { email: ADMIN_EMAIL } },
    },
  ]

  // Create platforms with their relationships - EXACTLY like the original
  for (const { categories, tags, ...platformData } of platformsData) {
    await db.tool.create({
      data: {
        ...platformData,
        content: DUMMY_CONTENT,
        faviconUrl: `https://www.google.com/s2/favicons?sz=128&domain_url=${platformData.websiteUrl}`,
        categories: { connect: categories.map(slug => ({ slug })) },
        tags: { connect: tags.map(slug => ({ slug })) },
      },
    })
  }

  console.log("Created ad spot platforms")
  console.log("Seeding completed!")
}

main()
  .catch(e => {
    console.error("Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })