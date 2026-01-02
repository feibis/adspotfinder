#!/usr/bin/env bun
import { db } from "~/services/db"

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

async function testConnection() {
  console.log("Testing database connection...")

  try {
    // Test basic connection with retry
    await retryWithBackoff(async () => {
      await db.$connect()
    })
    console.log("✅ Database connected successfully")

    // Test a simple query with retry (Neon serverless cold start handling)
    const userCount = await retryWithBackoff(async () => {
      return await db.user.count()
    })
    console.log(`✅ Found ${userCount} users in database`)

    // Test location table exists with retry
    const locationCount = await retryWithBackoff(async () => {
      return await db.location.count()
    })
    console.log(`✅ Found ${locationCount} locations in database`)

    console.log("\n🎉 Database is working correctly!")
    console.log("You can now run: bun run db:populate-locations")

  } catch (error) {
    console.error("❌ Database connection failed:")
    console.error("Message:", error.message)
    console.error("Code:", error.code || 'Unknown')

    if (error.code === 'ETIMEDOUT') {
      console.error("\n🔍 ETIMEDOUT Troubleshooting:")
      console.error("1. Database server not running")
      console.error("2. Wrong DATABASE_URL in .env")
      console.error("3. Firewall blocking connection")
      console.error("4. Database connection limits reached")
      console.error("5. 🔄 Neon serverless cold start - try again in 30 seconds")
    }

    if (error.code === 'P1001') {
      console.error("\n🔍 P1001 Troubleshooting:")
      console.error("Can't reach database server")
      console.error("- Check if database is running")
      console.error("- Verify DATABASE_URL format")
    }

    if (error.code === 'P2002') {
      console.error("\n🔍 P2002 Troubleshooting:")
      console.error("Unique constraint violation")
      console.error("- Data already exists")
    }

    console.error("\n💡 Quick fixes:")
    console.error("- Check .env DATABASE_URL")
    console.error("- Run: bun x prisma generate")
    console.error("- Run: bun x prisma db push")
    console.error("- Restart database service")
    console.error("- For Neon: wait 30s and retry (serverless cold start)")

    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

if (import.meta.main) {
  testConnection().catch(console.error)
}
