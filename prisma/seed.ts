import { addDays } from "date-fns"
import { ToolStatus } from "~/.generated/prisma/client"
import { db } from "~/services/db"
import { seedAttributes } from "./seed-attributes"
import { seedLocations } from "./seed-locations"

const ADMIN_EMAIL = "admin@adspotfinder.com"
const USER_EMAIL = "user@adspotfinder.com"

async function main() {
  const now = new Date()

  console.log("Starting fresh seeding for self-storage providers with online booking...")

  // Seed attributes first
  await seedAttributes(db)

  // Seed locations
  await seedLocations(db)

  // Create users
  await db.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      name: "Admin User",
      email: ADMIN_EMAIL,
      emailVerified: true,
      role: "admin",
    },
  })

  await db.user.upsert({
    where: { email: USER_EMAIL },
    update: {},
    create: {
      name: "User",
      email: USER_EMAIL,
      emailVerified: true,
      role: "user",
    },
  })

  console.log("Ensured users exist")

  // Create categories
  await db.category.createMany({
    data: [
      {
        name: "Self-Storage Chains",
        slug: "self-storage-chains",
        label: "Major Self-Storage Providers",
        description: "Leading self-storage companies offering units from small lockers to large commercial spaces with online booking and reservation.",
      },
      {
        name: "Online Booking Platforms",
        slug: "online-booking",
        label: "Instant/Online Reservation",
        description: "Providers with seamless online quote, reservation, and payment systems.",
      },
      {
        name: "Large Units",
        slug: "large-units",
        label: "Commercial & Large Storage",
        description: "Facilities offering large units (50+ m²) suitable for business inventory, vehicles, or bulk storage.",
      },
      {
        name: "Vehicle Storage",
        slug: "vehicle-storage",
        label: "Car, Boat & RV Storage",
        description: "Specialized storage for vehicles with drive-up access or dedicated parking.",
      },
    ],
    skipDuplicates: true,
  })

  console.log("Created categories")

  // Create tags
  await db.tag.createMany({
    data: [
      { name: "Online Booking", slug: "online-booking" },
      { name: "Instant Quote", slug: "instant-quote" },
      { name: "Large Units", slug: "large-units" },
      { name: "Commercial Storage", slug: "commercial-storage" },
      { name: "Vehicle Storage", slug: "vehicle-storage" },
      { name: "24/7 Access", slug: "24-7-access" },
      { name: "Climate Controlled", slug: "climate-controlled" },
      { name: "Drive-Up Access", slug: "drive-up-access" },
      { name: "Business Storage", slug: "business-storage" },
      { name: "UK", slug: "uk" },
      { name: "Germany", slug: "germany" },
      { name: "Europe", slug: "europe" },
    ],
    skipDuplicates: true,
  })

  console.log("Created tags")

  const platformsData = [
    {
      name: "Safestore",
      slug: "safestore",
      websiteUrl: "https://www.safestore.co.uk",
      tagline: "UK's largest self-storage provider with instant online booking",
      description:
        "Safestore is the UK's leading self-storage company with over 130 facilities nationwide. Offers a full online booking experience: instant quotes, unit selection, reservation, and payment in minutes. Wide range of unit sizes including large commercial spaces up to 500+ sq ft, perfect for business inventory, archiving, or vehicle storage. Features 24/7 access at many sites, climate control, and dedicated business services.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["self-storage-chains", "online-booking", "large-units"],
      tags: ["online-booking", "instant-quote", "large-units", "commercial-storage", "uk"],
    },
    {
      name: "Big Yellow Self Storage",
      slug: "big-yellow",
      websiteUrl: "https://www.bigyellow.co.uk",
      tagline: "Iconic UK self-storage with full online reservation",
      description:
        "Big Yellow is one of the most recognized self-storage brands in the UK, operating modern facilities in prime locations. Complete online booking flow with real-time availability, pricing, and secure payment. Offers units from small lockers to large rooms suitable for commercial use. Many sites feature drive-up access and extended hours.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["self-storage-chains", "online-booking", "large-units"],
      tags: ["online-booking", "drive-up-access", "large-units", "uk"],
    },
    {
      name: "Shurgard",
      slug: "shurgard",
      websiteUrl: "https://www.shurgard.com",
      tagline: "Europe's largest self-storage operator with online rental",
      description:
        "Shurgard is the biggest self-storage provider in Europe with facilities across the UK, Germany, France, Netherlands, Sweden, and more. Offers a fully digital rental process: choose unit online, complete contract, and pay securely. Large units available for business needs, plus vehicle storage options at select locations. High security standards and flexible terms.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["self-storage-chains", "online-booking", "large-units", "vehicle-storage"],
      tags: ["online-booking", "large-units", "vehicle-storage", "europe", "uk", "germany"],
    },
    {
      name: "MyPlace SelfStorage",
      slug: "myplace",
      websiteUrl: "https://www.myplace.eu/en",
      tagline: "Germany's leading self-storage with digital booking",
      description:
        "MyPlace operates modern self-storage facilities across Germany and Austria. Offers large units up to 200 m² ideal for commercial storage, furniture, or vehicles. Digital booking process with instant access codes upon completion. Many locations provide 24/7 access and climate-controlled options.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["self-storage-chains", "online-booking", "large-units"],
      tags: ["online-booking", "large-units", "24-7-access", "germany"],
    },
    {
      name: "LAGERBOX",
      slug: "lagerbox",
      websiteUrl: "https://www.lagerbox.com/en",
      tagline: "Modern German self-storage with easy online booking",
      description:
        "LAGERBOX provides clean, secure self-storage facilities throughout Germany. Online reservation system with transparent pricing and availability. Specializes in both personal and business storage with large units available. Focus on customer service and flexible access.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "commercial-storage", "germany"],
    },
    {
      name: "Cinch Self Storage",
      slug: "cinch-storage",
      websiteUrl: "https://www.cinchstorage.co.uk",
      tagline: "Fast online booking for UK self-storage",
      description:
        "Cinch offers modern self-storage facilities across the UK with a streamlined digital booking experience. Units suitable for personal and business use, including larger spaces for inventory or equipment. Emphasis on security and convenience.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "uk"],
    },
    {
      name: "SureStore",
      slug: "surestore",
      websiteUrl: "https://www.surestore.co.uk",
      tagline: "Premium UK storage with instant online quotes",
      description:
        "SureStore provides high-quality self-storage facilities in the UK with a focus on business customers. Full online quote and reservation system. Large units available with drive-up access at many locations.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["self-storage-chains", "online-booking", "large-units"],
      tags: ["instant-quote", "large-units", "business-storage", "uk"],
    },
    {
      name: "Blue Self Storage",
      slug: "blue-storage",
      websiteUrl: "https://www.blueselfstorage.co.uk",
      tagline: "Simple online booking across UK facilities",
      description:
        "Blue Self Storage offers secure, modern facilities with an easy-to-use online booking platform. Range of unit sizes including commercial options. Focus on customer convenience and transparent pricing.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "uk"],
    },
    {
      name: "Rentabox24",
      slug: "rentabox24",
      websiteUrl: "https://www.rentabox24.com/en",
      tagline: "Fully automated German self-storage",
      description:
        "Rentabox24 provides completely digital, contactless self-storage in Germany. Book and pay online, receive access code immediately via app. Large container-style units with 24/7 access.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["self-storage-chains", "online-booking", "large-units"],
      tags: ["online-booking", "24-7-access", "drive-up-access", "germany"],
    },
    {
      name: "HOMEBOX",
      slug: "homebox",
      websiteUrl: "https://www.homebox.eu",
      tagline: "Leading self-storage in France and Spain",
      description:
        "HOMEBOX is a major self-storage provider in France, Spain, and expanding in Europe. Offers online reservation and large units suitable for business needs. Modern facilities with high security.",
      status: ToolStatus.Published,
      publishedAt: now,
      screenshotUrl: "",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "large-units", "europe"],
    },
  ]

  // Create tools with full unique descriptions
  for (const { categories, tags, ...platformData } of platformsData) {
    await db.tool.upsert({
      where: { slug: platformData.slug },
      update: {
        ...platformData,
        categories: { set: [], connect: categories.map((slug: string) => ({ slug })) },
        tags: { set: [], connect: tags.map((slug: string) => ({ slug })) },
      },
      create: {
        ...platformData,
        content: platformData.description, // Use the full unique description as content
        faviconUrl: `https://www.google.com/s2/favicons?sz=128&domain_url=${platformData.websiteUrl}`,
        categories: { connect: categories.map((slug: string) => ({ slug })) },
        tags: { connect: tags.map((slug: string) => ({ slug })) },
      },
    })
  }

  console.log(`Successfully seeded ${platformsData.length} self-storage providers with full descriptions!`)
  
  // Seed locations
  await seedLocations()
  
  console.log("Fresh seeding completed!")
}

main()
  .catch(e => {
    console.error("Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })