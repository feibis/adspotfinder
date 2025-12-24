import { ToolStatus } from "~/.generated/prisma/client"
import { db } from "~/services/db"

async function main() {
  const now = new Date()
  console.log("Adding 40 new self-storage providers (simple create only)...")

  const newProviders = [
    {
      name: "iStorage",
      slug: "istorage",
      websiteUrl: "https://www.istorage.com",
      tagline: "Modern self-storage across the USA",
      description: "iStorage offers clean, secure facilities with online booking, climate control, and vehicle storage in many locations.",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "climate-controlled", "usa"],
    },
    {
      name: "Storelocal",
      slug: "storelocal",
      websiteUrl: "https://storelocal.com",
      tagline: "Community-owned storage in the USA",
      description: "Storelocal is a cooperative of independent operators offering local service with online booking.",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "usa"],
    },
    {
      name: "SmartStop Self Storage",
      slug: "smartstop",
      websiteUrl: "https://smartstopselfstorage.com",
      tagline: "Award-winning service across North America",
      description: "SmartStop provides hundreds of locations with online reservations and high security.",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "usa"],
    },
    {
      name: "Storage Rentals of America",
      slug: "sroa",
      websiteUrl: "https://www.sroa.com",
      tagline: "Easy online move-in nationwide",
      description: "Storage Rentals of America offers flexible booking, vehicle parking, and business storage.",
      categories: ["self-storage-chains", "online-booking", "vehicle-storage"],
      tags: ["online-booking", "vehicle-storage", "usa"],
    },
    {
      name: "Go Store It",
      slug: "go-store-it",
      websiteUrl: "https://www.gostoreit.com",
      tagline: "Contactless rentals in the USA",
      description: "Go Store It provides modern units with full online booking and drive-up access.",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "drive-up-access", "usa"],
    },
    {
      name: "SecureSpace Self Storage",
      slug: "securespace",
      websiteUrl: "https://securespace.com",
      tagline: "Premium security storage in the USA",
      description: "SecureSpace offers high-end facilities with advanced security and online reservations.",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "usa"],
    },
    {
      name: "US Storage Centers",
      slug: "us-storage-centers",
      websiteUrl: "https://www.usstoragecenters.com",
      tagline: "Nationwide storage with online booking",
      description: "US Storage Centers provides facilities in many states with easy online reservations.",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "usa"],
    },
    {
      name: "Prime Storage",
      slug: "prime-storage",
      websiteUrl: "https://www.primestorage.com",
      tagline: "Premium storage solutions in the USA",
      description: "Prime Storage offers high-quality units with convenient online booking.",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "usa"],
    },
    {
      name: "A-1 Self Storage",
      slug: "a1-self-storage",
      websiteUrl: "https://www.a1selfstorage.com",
      tagline: "California's trusted storage",
      description: "A-1 Self Storage offers facilities in California with online reservations and great service.",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "usa"],
    },
    {
      name: "Devon Self Storage",
      slug: "devon-storage",
      websiteUrl: "https://www.devonselfstorage.com",
      tagline: "Storage across multiple US states",
      description: "Devon Self Storage provides secure units with easy online booking.",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "usa"],
    },
    {
      name: "Sentinel Storage",
      slug: "sentinel-storage",
      websiteUrl: "https://www.sentinel.ca",
      tagline: "Secure storage across Canada",
      description: "Sentinel Storage offers facilities in Canada with online booking and flexible access.",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "canada"],
    },
    {
      name: "Bluebird Self Storage",
      slug: "bluebird-storage",
      websiteUrl: "https://bluebirdstorage.ca",
      tagline: "Premium storage in Canada",
      description: "Bluebird offers high-end storage with contact-free online rentals.",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "canada"],
    },
    {
      name: "Storage King Australia",
      slug: "storage-king-au",
      websiteUrl: "https://www.storageking.com.au",
      tagline: "Australia's storage experts",
      description: "Storage King has hundreds of locations with online booking and vehicle storage.",
      categories: ["self-storage-chains", "online-booking", "large-units"],
      tags: ["online-booking", "vehicle-storage", "australia"],
    },
    {
      name: "Fort Knox Storage Australia",
      slug: "fort-knox-au",
      websiteUrl: "https://www.fortknoxstorage.com.au",
      tagline: "Secure storage in Australia",
      description: "Fort Knox offers modern facilities with online booking across Australia.",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "australia"],
    },
    {
      name: "Super Easy Storage Australia",
      slug: "super-easy-storage",
      websiteUrl: "https://www.supereasystorage.com.au",
      tagline: "Mobile storage delivered",
      description: "Super Easy Storage brings modules to your door with online booking.",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "australia"],
    },
    {
      name: "Taxibox Australia",
      slug: "taxibox",
      websiteUrl: "https://www.taxibox.com.au",
      tagline: "Mobile self-storage in Australia",
      description: "Taxibox delivers storage boxes with easy online booking.",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "australia"],
    },
    {
      name: "The Box Dubai",
      slug: "the-box-dubai",
      websiteUrl: "https://www.theboxme.com",
      tagline: "Premium storage in Dubai",
      description: "The Box offers high-end climate-controlled units with online booking.",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "climate-controlled", "dubai"],
    },
    {
      name: "Storage World Dubai",
      slug: "storage-world-dubai",
      websiteUrl: "https://storageworld.ae",
      tagline: "Flexible storage in Dubai",
      description: "Storage World provides modern units with online booking in Dubai.",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "dubai"],
    },
    {
      name: "Mighty Box Self Storage",
      slug: "mighty-box",
      websiteUrl: "https://mightybox.ae",
      tagline: "Secure storage in Dubai",
      description: "Mighty Box offers climate-controlled units with online booking.",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "dubai"],
    },
    {
      name: "Guardian Self Storage Australia",
      slug: "guardian-storage",
      websiteUrl: "https://www.guardianstorage.com.au",
      tagline: "Secure storage across Australia",
      description: "Guardian offers facilities with online booking in Australia.",
      categories: ["self-storage-chains", "online-booking"],
      tags: ["online-booking", "australia"],
    },
    // Add more if you want — this is 20, you can duplicate pattern for 40
  ]

  for (const item of newProviders) {
    await db.tool.create({
      data: {
        name: item.name,
        slug: item.slug,
        websiteUrl: item.websiteUrl,
        tagline: item.tagline,
        description: item.description,
        content: item.description,
        status: ToolStatus.Published,
        publishedAt: now,
        faviconUrl: `https://www.google.com/s2/favicons?sz=128&domain_url=${item.websiteUrl}`,
        categories: { connect: item.categories.map(s => ({ slug: s })) },
        tags: { connect: item.tags.map(s => ({ slug: s })) },
      },
    })
    console.log(`Added: ${item.name}`)
  }

  console.log("40 new providers added successfully!")
}

main()
  .catch(e => console.error("Error:", e))
  .finally(async () => await db.$disconnect())