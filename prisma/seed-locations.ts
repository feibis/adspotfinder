import { Country, City } from "country-state-city"
import { db } from "~/services/db"

// Popular tech hub cities to include
const TECH_CITIES = [
  // United States
  { country: "US", state: "CA", city: "San Francisco" },
  { country: "US", state: "CA", city: "Los Angeles" },
  { country: "US", state: "CA", city: "San Diego" },
  { country: "US", state: "NY", city: "New York" },
  { country: "US", state: "MA", city: "Boston" },
  { country: "US", state: "WA", city: "Seattle" },
  { country: "US", state: "TX", city: "Austin" },
  { country: "US", state: "IL", city: "Chicago" },
  { country: "US", state: "CO", city: "Denver" },
  { country: "US", state: "FL", city: "Miami" },
  
  // United Kingdom
  { country: "GB", state: "ENG", city: "London" },
  { country: "GB", state: "ENG", city: "Manchester" },
  { country: "GB", state: "SCT", city: "Edinburgh" },
  
  // Canada
  { country: "CA", state: "ON", city: "Toronto" },
  { country: "CA", state: "BC", city: "Vancouver" },
  { country: "CA", state: "QC", city: "Montreal" },
  
  // Germany
  { country: "DE", state: "BE", city: "Berlin" },
  { country: "DE", state: "BY", city: "Munich" },
  
  // France
  { country: "FR", state: "IDF", city: "Paris" },
  
  // Netherlands
  { country: "NL", state: "NH", city: "Amsterdam" },
  
  // Spain
  { country: "ES", state: "MD", city: "Madrid" },
  { country: "ES", state: "CT", city: "Barcelona" },
  
  // Australia
  { country: "AU", state: "NSW", city: "Sydney" },
  { country: "AU", state: "VIC", city: "Melbourne" },
  
  // Singapore
  { country: "SG", state: "01", city: "Singapore" },
  
  // Japan
  { country: "JP", state: "13", city: "Tokyo" },
  
  // India
  { country: "IN", state: "KA", city: "Bangalore" },
  { country: "IN", state: "MH", city: "Mumbai" },
  
  // Brazil
  { country: "BR", state: "SP", city: "São Paulo" },
  
  // Mexico
  { country: "MX", state: "CMX", city: "Mexico City" },
]

// Priority countries (most common for SaaS/tech tools)
const PRIORITY_COUNTRIES = [
  "US", // United States
  "GB", // United Kingdom
  "CA", // Canada
  "DE", // Germany
  "FR", // France
  "AU", // Australia
  "NL", // Netherlands
  "ES", // Spain
  "IT", // Italy
  "SE", // Sweden
  "NO", // Norway
  "DK", // Denmark
  "FI", // Finland
  "CH", // Switzerland
  "AT", // Austria
  "BE", // Belgium
  "IE", // Ireland
  "NZ", // New Zealand
  "SG", // Singapore
  "JP", // Japan
  "IN", // India
  "BR", // Brazil
  "MX", // Mexico
  "AR", // Argentina
  "CL", // Chile
  "PL", // Poland
  "PT", // Portugal
  "CZ", // Czech Republic
  "IL", // Israel
  "AE", // UAE
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export async function seedLocations() {
  console.log("🌍 Seeding locations...")

  const locations: Array<{
    name: string
    slug: string
    type: string
    country: string | null
    countryCode: string | null
    stateCode: string | null
    emoji: string | null
  }> = []

  // Add "Worldwide" special location
  locations.push({
    name: "Worldwide",
    slug: "worldwide",
    type: "country",
    country: null,
    countryCode: "WW",
    stateCode: null,
    emoji: "🌍",
  })

  // Get all countries
  const allCountries = Country.getAllCountries()

  // Add priority countries
  for (const countryCode of PRIORITY_COUNTRIES) {
    const country = allCountries.find((c) => c.isoCode === countryCode)
    if (country) {
      locations.push({
        name: country.name,
        slug: slugify(country.name),
        type: "country",
        country: country.name,
        countryCode: country.isoCode,
        stateCode: null,
        emoji: country.flag,
      })
    }
  }

  // Add tech hub cities
  for (const cityData of TECH_CITIES) {
    const cities = City.getCitiesOfState(cityData.country, cityData.state)
    const city = cities.find((c) => c.name === cityData.city)
    const country = allCountries.find((c) => c.isoCode === cityData.country)

    if (city && country) {
      locations.push({
        name: city.name,
        slug: slugify(`${city.name}-${country.isoCode}`),
        type: "city",
        country: country.name,
        countryCode: country.isoCode,
        stateCode: city.stateCode,
        emoji: country.flag,
      })
    }
  }

  // Insert locations
  console.log(`📍 Creating ${locations.length} locations...`)

  for (const location of locations) {
    await db.location.upsert({
      where: { slug: location.slug },
      create: location,
      update: location,
    })
  }

  console.log(`✅ Successfully seeded ${locations.length} locations`)
  console.log(`   - 1 worldwide`)
  console.log(`   - ${PRIORITY_COUNTRIES.length} countries`)
  console.log(`   - ${TECH_CITIES.length} cities`)
}

