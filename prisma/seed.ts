import { addDays } from "date-fns"
import { ToolStatus } from "~/.generated/prisma/client"
import { db } from "~/services/db"

const ADMIN_EMAIL = "admin@dirstarter.com"
const USER_EMAIL = "user@dirstarter.com"

const DUMMY_CONTENT = `This tool has revolutionized the way developers approach modern software development. With its **intuitive interface** and powerful features, it streamlines workflows and enhances productivity across teams of all sizes. Whether you're a beginner just starting your development journey or an experienced professional working on complex enterprise applications, this tool provides the flexibility and reliability you need to succeed.

The platform offers a **comprehensive suite of features** designed to meet the diverse needs of today's development landscape. From advanced code editing capabilities to seamless integration with popular development tools and services, every aspect has been carefully crafted to provide an exceptional user experience. The robust plugin ecosystem further extends functionality, allowing teams to customize their workflow according to specific project requirements.

Setting up and getting started is remarkably straightforward, with detailed documentation and **community support** available to guide you through the process. The active community contributes to a wealth of tutorials, best practices, and real-world examples that help accelerate your learning curve. Regular updates and improvements ensure that you're always working with the latest features and security enhancements.`

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 8,
  baseDelay: number = 2000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries
      const isRetryableError = (
        error.code === 'ETIMEDOUT' ||
        error.message?.includes('ETIMEDOUT') ||
        error.message?.includes('timeout') ||
        error.message?.includes('Connection lost') ||
        error.message?.includes('connection') ||
        error.cause?.code === 'ETIMEDOUT' ||
        String(error).includes('ETIMEDOUT') ||
        error.code === 'P1001' || // Can't reach database server
        error.code === 'P2028'    // Transaction API error
      )

      if (isLastAttempt || !isRetryableError) {
        console.error(`❌ Final attempt failed:`, error.message || error)
        throw error
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), 30000) // Cap at 30 seconds
      console.log(`⏳ Attempt ${attempt}/${maxRetries} failed (${error.code || 'UNKNOWN'}). Retrying in ${delay}ms...`)
      await sleep(delay)
    }
  }
  throw new Error('Max retries exceeded')
}

async function main() {
  const now = new Date()

  console.log("Starting seeding...")

  // Create users individually with retry logic for Neon serverless cold starts
  try {
    await retryWithBackoff(async () => {
      return await db.user.upsert({
        where: { email: ADMIN_EMAIL },
        update: {
          name: "Admin User",
          emailVerified: true,
          role: "admin",
        },
        create: {
          name: "Admin User",
          email: ADMIN_EMAIL,
          emailVerified: true,
          role: "admin",
        },
      })
    })

    await retryWithBackoff(async () => {
      return await db.user.upsert({
        where: { email: USER_EMAIL },
        update: {
          name: "User",
          emailVerified: true,
          role: "user",
        },
        create: {
          name: "User",
          email: USER_EMAIL,
          emailVerified: true,
          role: "user",
        },
      })
    })

    console.log("Created users")
  } catch (error) {
    console.error("Failed to create users:", error)
    throw error
  }

  // Create categories individually with retry logic
  const categoriesData = [
    {
      name: "Frontend",
      slug: "frontend",
      type: "tool",
      label: "Frontend Development",
      description: "Tools for building the user interface of a website or application.",
    },
    {
      name: "Backend",
      slug: "backend",
      type: "tool",
      label: "Backend Development",
      description: "Tools for building the server-side of a website or application.",
    },
    {
      name: "DevOps",
      slug: "devops",
      type: "tool",
      label: "DevOps & Deployment",
      description: "Tools for deploying and managing applications.",
    },
    {
      name: "Design Tools",
      slug: "design-tools",
      type: "tool",
      label: "Design & UI/UX",
      description: "Tools for designing and creating user interfaces.",
    },
    {
      name: "Productivity",
      slug: "productivity",
      type: "tool",
      label: "Productivity Tools",
      description: "Tools for increasing productivity and efficiency.",
    },
    {
      name: "Testing",
      slug: "testing",
      type: "tool",
      label: "Testing & QA",
      description: "Tools for testing and quality assurance.",
    },
    {
      name: "Learning",
      slug: "learning",
      type: "tool",
      label: "Learning Resources",
      description: "Tools for learning and improving skills.",
    },
    {
      name: "AI Tools",
      slug: "ai-tools",
      type: "tool",
      label: "AI & Machine Learning",
      description: "Tools for using AI and machine learning.",
    },
  ]

  for (const category of categoriesData) {
    await retryWithBackoff(async () => {
      return await db.category.upsert({
        where: { slug: category.slug },
        update: category,
        create: category,
      })
    })
  }

  console.log("Created categories")

  // Create tags with retry logic
  await retryWithBackoff(async () => {
    return await db.tag.createMany({
      data: [
        { name: "React", slug: "react" },
        { name: "Vue", slug: "vue" },
        { name: "Angular", slug: "angular" },
        { name: "Svelte", slug: "svelte" },
        { name: "Node.js", slug: "nodejs" },
        { name: "Python", slug: "python" },
        { name: "TypeScript", slug: "typescript" },
        { name: "JavaScript", slug: "javascript" },
        { name: "CSS", slug: "css" },
        { name: "HTML", slug: "html" },
        { name: "Rust", slug: "rust" },
        { name: "Go", slug: "go" },
        { name: "AWS", slug: "aws" },
        { name: "Docker", slug: "docker" },
        { name: "Kubernetes", slug: "kubernetes" },
        { name: "CI/CD", slug: "ci-cd" },
        { name: "Free", slug: "free" },
        { name: "Paid", slug: "paid" },
        { name: "Open Source", slug: "open-source" },
        { name: "AI", slug: "ai" },
        { name: "API", slug: "api" },
      ],
    })
  })

  console.log("Created tags")

  // Create locations (comprehensive world regions) with retry logic
  await retryWithBackoff(async () => {
    return await db.location.createMany({
      data: [
        // North America
        {
          name: "United States",
          slug: "united-states",
          displayName: "United States",
        },
        {
          name: "Canada",
          slug: "canada",
          displayName: "Canada",
        },
        {
          name: "Mexico",
          slug: "mexico",
          displayName: "Mexico",
        },

        // Europe
        {
          name: "United Kingdom",
          slug: "united-kingdom",
          displayName: "United Kingdom",
        },
        {
          name: "Germany",
          slug: "germany",
          displayName: "Germany",
        },
        {
          name: "France",
          slug: "france",
          displayName: "France",
        },
        {
          name: "Netherlands",
          slug: "netherlands",
          displayName: "Netherlands",
        },
        {
          name: "Sweden",
          slug: "sweden",
          displayName: "Sweden",
        },

        // Asia-Pacific
        {
          name: "Japan",
          slug: "japan",
          displayName: "Japan",
        },
        {
          name: "South Korea",
          slug: "south-korea",
          displayName: "South Korea",
        },
        {
          name: "Australia",
          slug: "australia",
          displayName: "Australia",
        },
        {
          name: "Singapore",
          slug: "singapore",
          displayName: "Singapore",
        },
        {
          name: "India",
          slug: "india",
          displayName: "India",
        },

        // Other regions
        {
          name: "Global",
          slug: "global",
          displayName: "Global",
        },
      ],
    })
  })

  console.log("Created locations")

  // Create attribute groups individually to get their IDs
  const pricingGroup = await retryWithBackoff(async () => {
    return await db.attributeGroup.create({
      data: {
        name: "Pricing Model",
        slug: "pricing-model",
        order: 1,
      },
    })
  })

  const deploymentGroup = await retryWithBackoff(async () => {
    return await db.attributeGroup.create({
      data: {
        name: "Deployment",
        slug: "deployment",
        order: 2,
      },
    })
  })

  const integrationGroup = await retryWithBackoff(async () => {
    return await db.attributeGroup.create({
      data: {
        name: "Integration",
        slug: "integration",
        order: 3,
      },
    })
  })

  const adFormatGroup = await retryWithBackoff(async () => {
    return await db.attributeGroup.create({
      data: {
        name: "Ad Format",
        slug: "ad-format",
        order: 4,
      },
    })
  })

  const targetAudienceGroup = await retryWithBackoff(async () => {
    return await db.attributeGroup.create({
      data: {
        name: "Target Audience",
        slug: "target-audience",
        order: 5,
      },
    })
  })

  const durationGroup = await retryWithBackoff(async () => {
    return await db.attributeGroup.create({
      data: {
        name: "Duration",
        slug: "duration",
        order: 6,
      },
    })
  })

  console.log("Created attribute groups")

  // Create attributes using the actual group IDs
  await retryWithBackoff(async () => {
    return await db.attribute.createMany({
      data: [
        // Pricing Model attributes
        {
          name: "Free",
          slug: "free",
          groupId: pricingGroup.id,
          order: 1,
        },
        {
          name: "Freemium",
          slug: "freemium",
          groupId: pricingGroup.id,
          order: 2,
        },
        {
          name: "Paid",
          slug: "paid",
          groupId: pricingGroup.id,
          order: 3,
        },
        // Deployment attributes
        {
          name: "SaaS",
          slug: "saas",
          groupId: deploymentGroup.id,
          order: 1,
        },
        {
          name: "Self-hosted",
          slug: "self-hosted",
          groupId: deploymentGroup.id,
          order: 2,
        },
        {
          name: "Cloud",
          slug: "cloud",
          groupId: deploymentGroup.id,
          order: 3,
        },
        // Integration attributes
        {
          name: "API",
          slug: "api",
          groupId: integrationGroup.id,
          order: 1,
        },
        {
          name: "Webhook",
          slug: "webhook",
          groupId: integrationGroup.id,
          order: 2,
        },
        {
          name: "Zapier",
          slug: "zapier",
          groupId: integrationGroup.id,
          order: 3,
        },
        // Ad Format attributes
        {
          name: "Banner",
          slug: "banner",
          groupId: adFormatGroup.id,
          order: 1,
        },
        {
          name: "Sidebar",
          slug: "sidebar",
          groupId: adFormatGroup.id,
          order: 2,
        },
        {
          name: "Header",
          slug: "header",
          groupId: adFormatGroup.id,
          order: 3,
        },
        {
          name: "Footer",
          slug: "footer",
          groupId: adFormatGroup.id,
          order: 4,
        },
        {
          name: "Popup",
          slug: "popup",
          groupId: adFormatGroup.id,
          order: 5,
        },
        {
          name: "Native",
          slug: "native",
          groupId: adFormatGroup.id,
          order: 6,
        },
        // Target Audience attributes
        {
          name: "Developers",
          slug: "developers",
          groupId: targetAudienceGroup.id,
          order: 1,
        },
        {
          name: "Designers",
          slug: "designers",
          groupId: targetAudienceGroup.id,
          order: 2,
        },
        {
          name: "Startups",
          slug: "startups",
          groupId: targetAudienceGroup.id,
          order: 3,
        },
        {
          name: "Enterprise",
          slug: "enterprise",
          groupId: targetAudienceGroup.id,
          order: 4,
        },
        {
          name: "Students",
          slug: "students",
          groupId: targetAudienceGroup.id,
          order: 5,
        },
        // Duration attributes
        {
          name: "1 Day",
          slug: "1-day",
          groupId: durationGroup.id,
          order: 1,
        },
        {
          name: "1 Week",
          slug: "1-week",
          groupId: durationGroup.id,
          order: 2,
        },
        {
          name: "1 Month",
          slug: "1-month",
          groupId: durationGroup.id,
          order: 3,
        },
        {
          name: "3 Months",
          slug: "3-months",
          groupId: durationGroup.id,
          order: 4,
        },
        {
          name: "6 Months",
          slug: "6-months",
          groupId: durationGroup.id,
          order: 5,
        },
        {
          name: "1 Year",
          slug: "1-year",
          groupId: durationGroup.id,
          order: 6,
        },
      ],
    })
  })

  console.log("Created attributes")

  // Create shops individually with retry logic
  const shopsData = [
    {
      name: "TechStart Inc.",
      slug: "techstart-inc",
      email: "contact@techstart.com",
      phone: "+1-555-0101",
      websiteUrl: "https://techstart.com",
      description: "Leading provider of innovative tech solutions and developer tools.",
      instagramFollowers: 125000,
      tiktokFollowers: 89000,
    },
    {
      name: "DevTools Pro",
      slug: "devtools-pro",
      email: "hello@devtoolspro.com",
      phone: "+1-555-0202",
      websiteUrl: "https://devtoolspro.com",
      description: "Professional development tools for modern software teams.",
      instagramFollowers: 78000,
      tiktokFollowers: 156000,
    },
    {
      name: "CodeMasters",
      slug: "codemasters",
      email: "support@codemasters.io",
      phone: "+1-555-0303",
      websiteUrl: "https://codemasters.io",
      description: "Empowering developers with cutting-edge coding solutions.",
      instagramFollowers: 234000,
      tiktokFollowers: 312000,
    },
    {
      name: "AdSpace Solutions",
      slug: "adspace-solutions",
      email: "sales@adspace.com",
      phone: "+1-555-0404",
      websiteUrl: "https://adspace.com",
      description: "Premium advertising space provider for tech companies worldwide.",
      instagramFollowers: 45000,
      tiktokFollowers: 23000,
    },
    {
      name: "MediaHub Networks",
      slug: "mediahub-networks",
      email: "partners@mediahub.net",
      phone: "+1-555-0505",
      websiteUrl: "https://mediahub.net",
      description: "Global media network specializing in developer-focused advertising.",
      instagramFollowers: 89000,
      tiktokFollowers: 67000,
    },
    {
      name: "TechAds Pro",
      slug: "techads-pro",
      email: "info@techadspro.com",
      phone: "+1-555-0606",
      websiteUrl: "https://techadspro.com",
      description: "Professional advertising solutions for technology companies.",
      instagramFollowers: 156000,
      tiktokFollowers: 98000,
    },
    {
      name: "DevMarketing Hub",
      slug: "devmarketing-hub",
      email: "contact@devmarketinghub.com",
      phone: "+1-555-0707",
      websiteUrl: "https://devmarketinghub.com",
      description: "Marketing and advertising platform designed for developers.",
      instagramFollowers: 78000,
      tiktokFollowers: 124000,
    },
    {
      name: "CodeAds Network",
      slug: "codeads-network",
      email: "network@codeads.com",
      phone: "+1-555-0808",
      websiteUrl: "https://codeads.com",
      description: "Comprehensive advertising network for coding communities.",
      instagramFollowers: 203000,
      tiktokFollowers: 178000,
    },
    {
      name: "StartupAds Co",
      slug: "startupads-co",
      email: "hello@startupads.co",
      phone: "+1-555-0909",
      websiteUrl: "https://startupads.co",
      description: "Advertising solutions tailored for startups and tech innovators.",
      instagramFollowers: 67000,
      tiktokFollowers: 45000,
    },
    {
      name: "DigitalDev Ads",
      slug: "digitaldev-ads",
      email: "ads@digitaldev.com",
      phone: "+1-555-1010",
      websiteUrl: "https://digitaldev.com",
      description: "Digital advertising platform for development tools and services.",
      instagramFollowers: 112000,
      tiktokFollowers: 89000,
    },
  ]

  for (const shop of shopsData) {
    await retryWithBackoff(async () => {
      return await db.shop.upsert({
        where: { slug: shop.slug },
        update: shop,
        create: shop,
      })
    })
  }

  console.log("Created shops")

  // Connect shops to locations and categories with retry logic
  await retryWithBackoff(async () => {
    return await db.shop.update({
      where: { slug: "techstart-inc" },
      data: {
        locations: { connect: [{ slug: "united-states" }, { slug: "europe" }] },
        categories: { connect: [{ slug: "frontend" }, { slug: "productivity" }] },
      },
    })
  })

  await retryWithBackoff(async () => {
    return await db.shop.update({
      where: { slug: "devtools-pro" },
      data: {
        locations: { connect: [{ slug: "united-states" }, { slug: "asia" }] },
        categories: { connect: [{ slug: "backend" }, { slug: "devops" }] },
      },
    })
  })

  await retryWithBackoff(async () => {
    return await db.shop.update({
      where: { slug: "codemasters" },
      data: {
        locations: { connect: [{ slug: "europe" }, { slug: "asia" }] },
        categories: { connect: [{ slug: "ai-tools" }, { slug: "learning" }] },
      },
    })
  })

  // Connect new shops to locations and categories
  await retryWithBackoff(async () => {
    return await db.shop.update({
      where: { slug: "adspace-solutions" },
      data: {
        locations: { connect: [{ slug: "united-states" }, { slug: "canada" }] },
        categories: { connect: [{ slug: "productivity" }, { slug: "design-tools" }] },
      },
    })
  })

  await retryWithBackoff(async () => {
    return await db.shop.update({
      where: { slug: "mediahub-networks" },
      data: {
        locations: { connect: [{ slug: "united-states" }, { slug: "united-kingdom" }, { slug: "germany" }] },
        categories: { connect: [{ slug: "frontend" }, { slug: "backend" }] },
      },
    })
  })

  await retryWithBackoff(async () => {
    return await db.shop.update({
      where: { slug: "techads-pro" },
      data: {
        locations: { connect: [{ slug: "united-states" }, { slug: "australia" }] },
        categories: { connect: [{ slug: "devops" }, { slug: "testing" }] },
      },
    })
  })

  await retryWithBackoff(async () => {
    return await db.shop.update({
      where: { slug: "devmarketing-hub" },
      data: {
        locations: { connect: [{ slug: "united-states" }, { slug: "france" }, { slug: "netherlands" }] },
        categories: { connect: [{ slug: "learning" }, { slug: "ai-tools" }] },
      },
    })
  })

  await retryWithBackoff(async () => {
    return await db.shop.update({
      where: { slug: "codeads-network" },
      data: {
        locations: { connect: [{ slug: "united-states" }, { slug: "japan" }, { slug: "south-korea" }] },
        categories: { connect: [{ slug: "frontend" }, { slug: "productivity" }] },
      },
    })
  })

  await retryWithBackoff(async () => {
    return await db.shop.update({
      where: { slug: "startupads-co" },
      data: {
        locations: { connect: [{ slug: "united-states" }, { slug: "singapore" }] },
        categories: { connect: [{ slug: "design-tools" }, { slug: "testing" }] },
      },
    })
  })

  await retryWithBackoff(async () => {
    return await db.shop.update({
      where: { slug: "digitaldev-ads" },
      data: {
        locations: { connect: [{ slug: "united-states" }, { slug: "brazil" }, { slug: "mexico" }] },
        categories: { connect: [{ slug: "backend" }, { slug: "devops" }] },
      },
    })
  })

  console.log("Connected shops to locations and categories")

  // Create pricing combinations for tools with retry logic
  console.log("Creating tool pricing combinations...")

  // Get all attribute IDs for pricing combinations
  const attributes = await db.attribute.findMany()
  const getAttributeId = (slug: string) => attributes.find(attr => attr.slug === slug)?.id

  // Get tool IDs for pricing
  const tools = await db.tool.findMany()
  const getToolId = (slug: string) => tools.find(tool => tool.slug === slug)?.id

  // TechStart Inc. pricing combinations (first tool)
  // Create pricing for vscode tool
  if (getToolId("vscode")) {
    const vscodePricing = await retryWithBackoff(async () => {
      return await db.pricing.create({
        data: {
          name: "Basic Banner Ad",
          description: "Standard banner advertisement placement",
          price: 299.99,
          currency: "USD",
          period: "month",
          toolId: getToolId("vscode")!
        }
      })
    })

    // Connect attributes
    await retryWithBackoff(async () => {
      return await db.pricing.update({
        where: { id: vscodePricing.id },
        data: {
          attributes: {
            connect: [
              { id: getAttributeId("banner") },
              { id: getAttributeId("developers") },
              { id: getAttributeId("1-month") },
            ].filter(attr => attr.id) as any
          }
        }
      })
    })
  }

  // Create pricing records first
  const pricingData = []

  // Get sample tools for pricing
  const sampleTools = ["vscode", "react", "nextjs", "tailwindcss"]

  for (const toolSlug of sampleTools) {
    const toolId = getToolId(toolSlug)
    if (!toolId) continue

    pricingData.push(
      {
        name: "Basic Banner Ad",
        description: "Standard banner advertisement placement",
        price: 299.99,
        currency: "USD",
        period: "month",
        toolId: toolId,
      },
      {
        name: "Premium Package",
        description: "Premium placement with advanced targeting",
        price: 599.99,
        currency: "USD",
        period: "month",
        toolId: toolId,
      },
      {
        name: "Enterprise Solution",
        description: "Enterprise-level advertising campaign",
        price: 1299.99,
        currency: "USD",
        period: "month",
        toolId: toolId,
      }
    )
  }

  // Create pricing records
  const createdPricings = []
  for (const pricing of pricingData) {
    const created = await retryWithBackoff(async () => {
      return await db.pricing.create({
        data: pricing
      })
    })
    createdPricings.push(created)
  }

  // Now connect attributes to pricings
  for (let i = 0; i < createdPricings.length; i++) {
    const pricing = createdPricings[i]
    const toolSlug = sampleTools[Math.floor(i / 3)]
    const pricingIndex = i % 3

    let attributeIds = []
    if (pricingIndex === 0) { // Basic Banner Ad
      attributeIds = [
        getAttributeId("banner"),
        getAttributeId("developers"),
        getAttributeId("1-month"),
      ].filter(id => id)
    } else if (pricingIndex === 1) { // Premium Package
      attributeIds = [
        getAttributeId("sidebar"),
        getAttributeId("native"),
        getAttributeId("developers"),
        getAttributeId("3-months"),
      ].filter(id => id)
    } else { // Enterprise Solution
      attributeIds = [
        getAttributeId("header"),
        getAttributeId("banner"),
        getAttributeId("sidebar"),
        getAttributeId("enterprise"),
        getAttributeId("6-months"),
      ].filter(id => id)
    }

    if (attributeIds.length > 0) {
      await retryWithBackoff(async () => {
        return await db.pricing.update({
          where: { id: pricing.id },
          data: {
            attributes: {
              connect: attributeIds.map(id => ({ id }))
            }
          }
        })
      })
    }
  }

  console.log("Created shop pricing combinations")

  // Create tools
  const toolsData = [
    {
      name: "VS Code",
      slug: "vscode",
      websiteUrl: "https://code.visualstudio.com",
      tagline: "Free source-code editor made by Microsoft",
      description:
        "Visual Studio Code is a lightweight but powerful source code editor with support for many programming languages through extensions.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://code.visualstudio.com/opengraphimg/opengraph-home.png",
      categories: ["frontend"],
      tags: ["free", "open-source"],
      owner: { connect: { email: "admin@dirstarter.com" } },
    },
    {
      name: "Next.js",
      slug: "nextjs",
      websiteUrl: "https://nextjs.org",
      tagline: "The full-stack React framework for the web",
      description:
        "Next.js gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://assets.vercel.com/image/upload/front/nextjs/twitter-card.png",
      categories: ["frontend"],
      tags: ["typescript", "javascript", "free", "open-source"],
    },
    {
      name: "Docker",
      slug: "docker",
      websiteUrl: "https://www.docker.com",
      tagline: "Accelerate how you build, share and run modern applications",
      description:
        "Docker is an open platform for developing, shipping, and running applications in containers.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://www.docker.com/app/uploads/2023/06/meta-image-homepage-1110x580.png",
      categories: ["devops"],
      tags: ["docker", "free", "open-source"],
    },
    {
      name: "Figma",
      slug: "figma",
      websiteUrl: "https://www.figma.com",
      tagline: "Design, prototype, and collaborate all in the browser",
      description:
        "Figma is a vector graphics editor and prototyping tool, primarily web-based with additional offline features through desktop applications.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl:
        "https://cdn.sanity.io/images/599r6htc/regionalized/1adfa5a99040c80af7b4b5e3e2cf845315ea2367-2400x1260.png?w=1200&q=70&fit=max&auto=format",
      categories: ["design-tools"],
      tags: ["free", "paid"],
    },
    {
      name: "Node.js",
      slug: "nodejs",
      websiteUrl: "https://nodejs.org",
      tagline: "JavaScript runtime built on Chrome's V8 JavaScript engine",
      description:
        "Node.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside a web browser.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl:
        "https://nodejs.org/en/next-data/og/announcement/Node.js%20%E2%80%94%20Run%20JavaScript%20Everywhere",
      categories: ["backend"],
      tags: ["nodejs", "javascript", "free", "open-source"],
    },
    {
      name: "Claude",
      slug: "claude",
      websiteUrl: "https://claude.ai",
      tagline: "Advanced AI assistant for coding and analysis",
      description:
        "Claude is an AI assistant by Anthropic that excels at coding, analysis, and creative tasks. It can help with code review, debugging, and explaining complex concepts.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://claude.ai/images/claude_ogimage.png",
      categories: ["productivity", "ai-tools"],
      tags: ["paid", "ai"],
    },
    {
      name: "Jest",
      slug: "jest",
      websiteUrl: "https://jestjs.io",
      tagline: "Delightful JavaScript Testing",
      description:
        "Jest is a JavaScript testing framework designed to ensure correctness of any JavaScript codebase.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://jestjs.io/img/opengraph.png",
      categories: ["testing"],
      tags: ["typescript", "javascript", "free", "open-source"],
    },
    {
      name: "AWS",
      slug: "aws",
      websiteUrl: "https://aws.amazon.com",
      tagline: "The most comprehensive and broadly adopted cloud platform",
      description:
        "Amazon Web Services offers reliable, scalable, and inexpensive cloud computing services.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png",
      categories: ["devops"],
      tags: ["aws", "paid"],
    },
    {
      name: "MDN Web Docs",
      slug: "mdn-web-docs",
      websiteUrl: "https://developer.mozilla.org",
      tagline: "Resources for developers, by developers",
      description:
        "MDN Web Docs is an open-source, collaborative project documenting Web platform technologies.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://developer.mozilla.org/mdn-social-share.d893525a4fb5fb1f67a2.png",
      categories: ["learning"],
      tags: ["javascript", "css", "html", "free", "open-source"],
    },
    {
      name: "ChatGPT",
      slug: "chatgpt",
      websiteUrl: "https://chatgpt.com",
      tagline: "A conversational AI system that listens, learns, and challenges",
      description:
        "ChatGPT is a large language model developed by OpenAI that can generate human-like text based on the context and prompt it's given.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://cdn.oaistatic.com/assets/chatgpt-share-og-u7j5uyao.webp",
      categories: ["ai-tools", "productivity"],
      tags: ["free", "paid", "ai"],
    },
    {
      name: "Tailwind CSS",
      slug: "tailwind-css",
      websiteUrl: "https://tailwindcss.com",
      tagline: "A utility-first CSS framework for rapid UI development",
      description:
        "Tailwind CSS is a utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://tailwindcss.com/opengraph-image.jpg",
      categories: ["frontend"],
      tags: ["css", "free", "open-source"],
    },
    {
      name: "React",
      slug: "react",
      websiteUrl: "https://react.dev",
      tagline: "The library for web and native user interfaces",
      description:
        "React is a JavaScript library for building user interfaces, particularly single-page applications.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "https://react.dev/images/og-home.png",
      categories: ["frontend"],
      tags: ["react", "javascript", "free", "open-source"],
    },
    {
      name: "Postman",
      slug: "postman",
      websiteUrl: "https://www.postman.com",
      tagline: "API platform for building and using APIs",
      description:
        "Postman is an API platform for developers to design, build, test and iterate their APIs.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl:
        "https://voyager.postman.com/social-preview/postman-api-platform-social-preview-2.jpeg",
      categories: ["testing", "backend"],
      tags: ["free", "paid", "api"],
    },
    {
      name: "GitHub",
      slug: "github",
      websiteUrl: "https://github.com",
      tagline: "Build and ship software on a single, collaborative platform",
      description:
        "GitHub is a code hosting platform for version control and collaboration, letting you and others work together on projects.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl:
        "https://github.githubassets.com/images/modules/site/social-cards/github-social.png",
      categories: ["devops"],
      tags: ["free", "paid", "open-source", "ci-cd"],
    },
    {
      name: "SvelteKit",
      slug: "sveltekit",
      websiteUrl: "https://svelte.dev",
      tagline: "The fastest way to build Svelte apps",
      description:
        "SvelteKit is a framework for building web applications of all sizes, with a beautiful development experience and flexible filesystem-based routing.",
      status: ToolStatus.Scheduled,
      publishedAt: addDays(now, 7),
      screenshotUrl: "https://svelte.dev/images/twitter-thumbnail.jpg",
      categories: ["frontend"],
      tags: ["svelte", "javascript", "free", "open-source"],
      owner: { connect: { email: "admin@dirstarter.com" } },
    },
    {
      name: "Rust",
      slug: "rust",
      websiteUrl: "https://www.rust-lang.org",
      tagline: "A language empowering everyone to build reliable and efficient software",
      description:
        "Rust is a multi-paradigm, general-purpose programming language designed for performance and safety, especially safe concurrency.",
      status: ToolStatus.Draft,
      screenshotUrl: "https://www.rust-lang.org/static/images/rust-social-wide.jpg",
      categories: ["backend"],
      tags: ["rust", "free", "open-source"],
      owner: { connect: { email: "admin@dirstarter.com" } },
    },
    {
      name: "Kubernetes",
      slug: "kubernetes",
      websiteUrl: "https://kubernetes.io",
      tagline: "Production-Grade Container Orchestration",
      description:
        "Kubernetes is an open-source container orchestration platform for automating deployment, scaling, and management of containerized applications.",
      status: ToolStatus.Draft,
      screenshotUrl: "https://kubernetes.io/images/kubernetes-open-graph.png",
      categories: ["devops"],
      tags: ["kubernetes", "free", "open-source"],
      owner: { connect: { email: "admin@dirstarter.com" } },
    },
  ]

  // Create tools with their relationships with retry logic
  for (const { categories, tags, ...toolData } of toolsData) {
    await retryWithBackoff(async () => {
      return await db.tool.create({
        data: {
          ...toolData,
          content: DUMMY_CONTENT,
          faviconUrl: `https://www.google.com/s2/favicons?sz=128&domain_url=${toolData.websiteUrl}`,
          categories: { connect: categories.map(slug => ({ slug })) },
          tags: { connect: tags.map(slug => ({ slug })) },
        },
      })
    })
  }

  console.log("Created tools")
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