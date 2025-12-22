import { addDays } from "date-fns"
import { ToolStatus } from "~/.generated/prisma/client"
import { db } from "~/services/db"

const ADMIN_EMAIL = "admin@litelocker.com"
const USER_EMAIL = "user@litelocker.com"

const DUMMY_CONTENT = `This is a major aggregator, developer, or operator in the commercial/industrial warehouse and logistics space market in Poland. These platforms and companies provide listings, leasing opportunities, and development of large-scale warehouse facilities (big-box logistics parks, distribution centers, and industrial halls) across key regions like Warsaw, Upper Silesia, Central Poland, Wrocław, and Poznań. Many offer searchable databases for renting or inquiring about spaces from 1,000+ m², often through brokers or direct contact.

The Polish warehouse market is one of Europe's largest and fastest-growing, with over 35 million m² of modern space. Listings typically include details on location, size, availability, amenities (e.g., high-bay storage, cross-docking, ESG features), and connectivity to highways/ports. Major developers dominate supply, while aggregators help tenants find and compare options efficiently.

Getting started involves searching by region/size, contacting for quotes, or negotiating leases (often long-term). Many sites provide market reports, investment insights, and advisory services.`

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
    skipDuplicates: true,
  })

  console.log("Created users")

  // Create categories
  await db.category.createMany({
    data: [
      {
        name: "Aggregators",
        slug: "aggregators",
        label: "Warehouse Aggregators & Platforms",
        description: "Directories and marketplaces aggregating warehouse listings from multiple developers/operators in Poland.",
      },
      {
        name: "Developers",
        slug: "developers",
        label: "Major Warehouse Developers",
        description: "Leading developers building and managing large logistics parks and industrial facilities.",
      },
      {
        name: "Advisory",
        slug: "advisory",
        label: "Commercial Real Estate Advisory",
        description: "Brokerage and advisory firms with extensive warehouse databases and tenant representation.",
      },
    ],
    skipDuplicates: true,
  })

  console.log("Created categories")

  // Create tags
  await db.tag.createMany({
    data: [
      { name: "Warehouse Rental", slug: "warehouse-rental" },
      { name: "Logistics Parks", slug: "logistics-parks" },
      { name: "Industrial Halls", slug: "industrial-halls" },
      { name: "Big Box", slug: "big-box" },
      { name: "Poland Market", slug: "poland-market" },
      { name: "Leasing", slug: "leasing" },
      { name: "Distribution Centers", slug: "distribution-centers" },
      { name: "SBU", slug: "sbu" },
      { name: "Market Reports", slug: "market-reports" },
      { name: "Tenant Representation", slug: "tenant-representation" },
    ],
    skipDuplicates: true,
  })

  console.log("Created tags")

  const platformsData = [
    {
      name: "PolandWarehouses.com",
      slug: "polandwarehouses",
      websiteUrl: "https://www.polandwarehouses.com",
      tagline: "Dedicated warehouse search and advisory platform by Newmark Polska",
      description: "Comprehensive aggregator for warehouse and industrial space rentals across Poland, with tenant-focused listings and market insights.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "", // Placeholder; update if needed
      categories: ["aggregators", "advisory"],
      tags: ["warehouse-rental", "logistics-parks", "tenant-representation"],
      owner: { connect: { email: ADMIN_EMAIL } },
    },
    {
      name: "AXI IMMO Warehouse Space",
      slug: "axiimmo",
      websiteUrl: "https://www.axiimmo.com/en/warehouse-space/",
      tagline: "Extensive database of warehouses and halls for lease",
      description: "Leading advisory firm with a large searchable database of logistics and production facilities from major developers.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["aggregators", "advisory"],
      tags: ["warehouse-rental", "industrial-halls", "market-reports"],
    },
    {
      name: "Warehouserentinfo.pl",
      slug: "warehouserentinfo",
      websiteUrl: "https://www.warehouserentinfo.pl/",
      tagline: "Warehouse rental info and listings portal",
      description: "Aggregator of warehouse offers, news, and market updates for commercial spaces in Poland.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["aggregators"],
      tags: ["warehouse-rental", "logistics-parks"],
    },
    {
      name: "Industrial.pl (Cushman & Wakefield)",
      slug: "industrial-pl",
      websiteUrl: "https://industrial.pl/en",
      tagline: "Warehouse and production market insights and listings",
      description: "Global firm's Polish portal for industrial/warehouse rentals and advisory.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["aggregators", "advisory"],
      tags: ["leasing", "market-reports", "big-box"],
    },
    {
      name: "Panattoni",
      slug: "panattoni",
      websiteUrl: "https://panattoni.pl/en", // or Polish version
      tagline: "Europe's leading industrial developer",
      description: "Largest warehouse developer in Poland, building massive logistics parks nationwide.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["developers"],
      tags: ["logistics-parks", "big-box", "distribution-centers"],
    },
    {
      name: "Prologis Poland",
      slug: "prologis",
      websiteUrl: "https://www.prologis.pl/en",
      tagline: "Global leader in logistics real estate",
      description: "Major operator of premium distribution centers and parks across Poland.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["developers"],
      tags: ["logistics-parks", "distribution-centers"],
    },
    {
      name: "Segro Poland",
      slug: "segro",
      websiteUrl: "https://www.segro.com/pl/en",
      tagline: "Flexible industrial and warehouse spaces",
      description: "Developer focused on logistics parks, city logistics, and SBU formats.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["developers"],
      tags: ["industrial-halls", "sbu"],
    },
    {
      name: "7R",
      slug: "7r",
      websiteUrl: "https://7rsa.pl/en/",
      tagline: "Modern warehouse solutions",
      description: "Fast-growing Polish developer of high-quality logistics and city-flex parks.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["developers"],
      tags: ["logistics-parks", "poland-market"],
    },
    {
      name: "Hillwood Poland",
      slug: "hillwood",
      websiteUrl: "https://hillwood.pl/en/",
      tagline: "Investment and development in logistics",
      description: "Developer of large-scale warehouse parks in strategic locations.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["developers"],
      tags: ["big-box", "leasing"],
    },
    {
      name: "P3 Logistic Parks",
      slug: "p3",
      websiteUrl: "https://www.p3parks.com/pl/",
      tagline: "Long-term warehouse solutions",
      description: "European operator with extensive parks for distribution and manufacturing.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["developers"],
      tags: ["distribution-centers", "logistics-parks"],
    },
    {
      name: "MLP Group",
      slug: "mlp",
      websiteUrl: "https://mlpgroup.com/en/",
      tagline: "Logistics parks developer",
      description: "Specialist in big-box and city logistics warehouses.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["developers"],
      tags: ["big-box", "industrial-halls"],
    },
    {
      name: "Logicor Poland",
      slug: "logicor",
      websiteUrl: "https://www.logicor.eu/pl/",
      tagline: "Pan-European logistics real estate",
      description: "Owner and manager of modern warehouse facilities.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["developers"],
      tags: ["warehouse-rental", "logistics-parks"],
    },
    {
      name: "CTP Poland",
      slug: "ctp",
      websiteUrl: "https://ctp.eu/industrial-warehouse-office-finder/poland/",
      tagline: "Industrial and warehouse finder",
      description: "Developer of business parks with warehouse space across Poland.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["developers"],
      tags: ["industrial-halls", "poland-market"],
    },
    {
      name: "Waredock Poland",
      slug: "waredock",
      websiteUrl: "https://www.waredock.com/locations/poland/",
      tagline: "Fulfillment and warehouse network aggregator",
      description: "Platform connecting to multiple warehouses for e-commerce and logistics.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["aggregators"],
      tags: ["warehouse-rental", "distribution-centers"],
    },
    {
      name: "PolandWarehouses.online",
      slug: "polandwarehouses-online",
      websiteUrl: "https://polandwarehouses.online/",
      tagline: "Warehouse spaces for rent database",
      description: "Large portal for finding industrial and production halls.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["aggregators"],
      tags: ["warehouse-rental", "industrial-halls"],
    },
    {
      name: "Companyspace.com Poland",
      slug: "companyspace-poland",
      websiteUrl: "https://www.companyspace.com/poland/rent/warehouses",
      tagline: "European warehouse rental platform",
      description: "Aggregator for logistics properties and warehouses in Poland.",
      status: ToolStatus.Scheduled,
      publishedAt: addDays(now, 7),
      screenshotUrl: "",
      categories: ["aggregators"],
      tags: ["leasing", "logistics-parks"],
      owner: { connect: { email: ADMIN_EMAIL } },
    },
    {
      name: "GLP Poland",
      slug: "glp",
      websiteUrl: "https://www.glp.com/eu/pl/", // Adjust if specific
      tagline: "Global logistics provider",
      description: "Developer of advanced logistics facilities (mentioned in market contexts).",
      status: ToolStatus.Draft,
      screenshotUrl: "",
      categories: ["developers"],
      tags: ["big-box", "distribution-centers"],
      owner: { connect: { email: ADMIN_EMAIL } },
    },
  ]

  for (const { categories, tags, ...platformData } of platformsData) {
    await db.tool.create({
      data: {
        ...platformData,
        content: DUMMY_CONTENT,
        faviconUrl: `https://www.google.com/s2/favicons?sz=128&domain_url=${platformData.websiteUrl}`,
        categories: { connect: categories.map(slug => ({ slug })) },
        tags: { connect: tags.map(slug => ({ slug })) },
      },
      // Use upsert or skipDuplicates if needed
    })
  }

  console.log("Created warehouse platforms")
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