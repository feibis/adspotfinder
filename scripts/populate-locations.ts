#!/usr/bin/env bun
import { db } from "~/services/db"

// Comprehensive list of countries and regions for production seeding
const LOCATIONS = [
  // North America
  { name: "United States", slug: "united-states", label: "United States", description: "Tools and services available in the United States." },
  { name: "Canada", slug: "canada", label: "Canada", description: "Tools and services available in Canada." },
  { name: "Mexico", slug: "mexico", label: "Mexico", description: "Tools and services available in Mexico." },

  // Europe
  { name: "United Kingdom", slug: "united-kingdom", label: "United Kingdom", description: "Tools and services available in the United Kingdom." },
  { name: "Germany", slug: "germany", label: "Germany", description: "Tools and services available in Germany." },
  { name: "France", slug: "france", label: "France", description: "Tools and services available in France." },
  { name: "Italy", slug: "italy", label: "Italy", description: "Tools and services available in Italy." },
  { name: "Spain", slug: "spain", label: "Spain", description: "Tools and services available in Spain." },
  { name: "Netherlands", slug: "netherlands", label: "Netherlands", description: "Tools and services available in the Netherlands." },
  { name: "Belgium", slug: "belgium", label: "Belgium", description: "Tools and services available in Belgium." },
  { name: "Switzerland", slug: "switzerland", label: "Switzerland", description: "Tools and services available in Switzerland." },
  { name: "Austria", slug: "austria", label: "Austria", description: "Tools and services available in Austria." },
  { name: "Sweden", slug: "sweden", label: "Sweden", description: "Tools and services available in Sweden." },
  { name: "Norway", slug: "norway", label: "Norway", description: "Tools and services available in Norway." },
  { name: "Denmark", slug: "denmark", label: "Denmark", description: "Tools and services available in Denmark." },
  { name: "Finland", slug: "finland", label: "Finland", description: "Tools and services available in Finland." },
  { name: "Ireland", slug: "ireland", label: "Ireland", description: "Tools and services available in Ireland." },
  { name: "Portugal", slug: "portugal", label: "Portugal", description: "Tools and services available in Portugal." },
  { name: "Poland", slug: "poland", label: "Poland", description: "Tools and services available in Poland." },
  { name: "Czech Republic", slug: "czech-republic", label: "Czech Republic", description: "Tools and services available in the Czech Republic." },

  // Asia-Pacific
  { name: "Japan", slug: "japan", label: "Japan", description: "Tools and services available in Japan." },
  { name: "South Korea", slug: "south-korea", label: "South Korea", description: "Tools and services available in South Korea." },
  { name: "China", slug: "china", label: "China", description: "Tools and services available in China." },
  { name: "India", slug: "india", label: "India", description: "Tools and services available in India." },
  { name: "Australia", slug: "australia", label: "Australia", description: "Tools and services available in Australia." },
  { name: "New Zealand", slug: "new-zealand", label: "New Zealand", description: "Tools and services available in New Zealand." },
  { name: "Singapore", slug: "singapore", label: "Singapore", description: "Tools and services available in Singapore." },
  { name: "Hong Kong", slug: "hong-kong", label: "Hong Kong", description: "Tools and services available in Hong Kong." },
  { name: "Taiwan", slug: "taiwan", label: "Taiwan", description: "Tools and services available in Taiwan." },
  { name: "Malaysia", slug: "malaysia", label: "Malaysia", description: "Tools and services available in Malaysia." },
  { name: "Thailand", slug: "thailand", label: "Thailand", description: "Tools and services available in Thailand." },
  { name: "Indonesia", slug: "indonesia", label: "Indonesia", description: "Tools and services available in Indonesia." },
  { name: "Philippines", slug: "philippines", label: "Philippines", description: "Tools and services available in Philippines." },
  { name: "Vietnam", slug: "vietnam", label: "Vietnam", description: "Tools and services available in Vietnam." },

  // Middle East & Africa
  { name: "Israel", slug: "israel", label: "Israel", description: "Tools and services available in Israel." },
  { name: "United Arab Emirates", slug: "united-arab-emirates", label: "United Arab Emirates", description: "Tools and services available in the UAE." },
  { name: "Saudi Arabia", slug: "saudi-arabia", label: "Saudi Arabia", description: "Tools and services available in Saudi Arabia." },
  { name: "Turkey", slug: "turkey", label: "Turkey", description: "Tools and services available in Turkey." },
  { name: "South Africa", slug: "south-africa", label: "South Africa", description: "Tools and services available in South Africa." },
  { name: "Egypt", slug: "egypt", label: "Egypt", description: "Tools and services available in Egypt." },
  { name: "Nigeria", slug: "nigeria", label: "Nigeria", description: "Tools and services available in Nigeria." },
  { name: "Kenya", slug: "kenya", label: "Kenya", description: "Tools and services available in Kenya." },
  { name: "Ghana", slug: "ghana", label: "Ghana", description: "Tools and services available in Ghana." },

  // South America
  { name: "Brazil", slug: "brazil", label: "Brazil", description: "Tools and services available in Brazil." },
  { name: "Argentina", slug: "argentina", label: "Argentina", description: "Tools and services available in Argentina." },
  { name: "Chile", slug: "chile", label: "Chile", description: "Tools and services available in Chile." },
  { name: "Colombia", slug: "colombia", label: "Colombia", description: "Tools and services available in Colombia." },
  { name: "Peru", slug: "peru", label: "Peru", description: "Tools and services available in Peru." },
  { name: "Venezuela", slug: "venezuela", label: "Venezuela", description: "Tools and services available in Venezuela." },
  { name: "Uruguay", slug: "uruguay", label: "Uruguay", description: "Tools and services available in Uruguay." },

  // Other regions
  { name: "Global", slug: "global", label: "Global", description: "Tools and services available worldwide." },
  { name: "Remote", slug: "remote", label: "Remote", description: "Remote work and distributed teams." },
]

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 5,
  baseDelay: number = 1000
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
        error.cause?.code === 'ETIMEDOUT' ||
        String(error).includes('ETIMEDOUT')
      )

      if (isLastAttempt || !isRetryableError) {
        throw error
      }

      const delay = baseDelay * Math.pow(2, attempt - 1) // Exponential backoff
      console.log(`⏳ Attempt ${attempt} failed. Retrying in ${delay}ms...`)
      await sleep(delay)
    }
  }
  throw new Error('Max retries exceeded')
}

async function main() {
  console.log("Populating location data...")

  try {
    // Test database connection with retry
    await retryWithBackoff(async () => {
      return await db.$connect()
    })
    console.log("Database connected successfully")

    // Clear existing locations with retry
    await retryWithBackoff(async () => {
      return await db.location.deleteMany()
    })
    console.log("Cleared existing locations")

    // Insert comprehensive location data with retry
    await retryWithBackoff(async () => {
      return await db.location.createMany({
        data: LOCATIONS,
      })
    })

    console.log(`Created ${LOCATIONS.length} locations`)

    // Log some examples
    console.log("\nSample locations created:")
    console.log("- United States (united-states)")
    console.log("- Germany (germany)")
    console.log("- Japan (japan)")
    console.log("- Global (global)")
    console.log("\n... and", LOCATIONS.length - 4, "more countries/regions")

  } catch (error: any) {
    console.error("Error populating locations:")
    console.error("Message:", error.message)
    console.error("Code:", error.code)

    if (error.code === 'ETIMEDOUT') {
      console.error("\n🔍 Troubleshooting ETIMEDOUT:")
      console.error("1. Check if your database is running")
      console.error("2. Verify DATABASE_URL in your .env file")
      console.error("3. Test connection: bun x prisma db push")
      console.error("4. Run migrations: bun x prisma migrate deploy")
    }

    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

if (import.meta.main) {
  main().catch(console.error)
}
