#!/usr/bin/env bun
import { db } from "~/services/db"

// Option 1: Fetch from REST Countries API (free, no API key needed)
async function fetchFromRestCountries() {
  console.log("Fetching countries from REST Countries API...")

  try {
    const response = await fetch("https://restcountries.com/v3.1/all")
    const countries = await response.json()

    const locations = countries.map((country: any) => ({
      name: country.name.common,
      slug: country.name.common.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      label: country.name.common,
      description: `Tools and services available in ${country.name.common}.`,
    }))

    return locations
  } catch (error) {
    console.error("Failed to fetch from REST Countries:", error)
    return []
  }
}

// Option 2: Use predefined comprehensive list (for when API is unavailable)
function getFallbackLocations() {
  return [
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
    { name: "South Africa", slug: "south-africa", label: "South Africa", description: "Tools and services available in South Africa." },
    { name: "Egypt", slug: "egypt", label: "Egypt", description: "Tools and services available in Egypt." },
    { name: "Nigeria", slug: "nigeria", label: "Nigeria", description: "Tools and services available in Nigeria." },
    { name: "Kenya", slug: "kenya", label: "Kenya", description: "Tools and services available in Kenya." },

    // South America
    { name: "Brazil", slug: "brazil", label: "Brazil", description: "Tools and services available in Brazil." },
    { name: "Argentina", slug: "argentina", label: "Argentina", description: "Tools and services available in Argentina." },
    { name: "Chile", slug: "chile", label: "Chile", description: "Tools and services available in Chile." },
    { name: "Colombia", slug: "colombia", label: "Colombia", description: "Tools and services available in Colombia." },
    { name: "Peru", slug: "peru", label: "Peru", description: "Tools and services available in Peru." },

    // Other
    { name: "Global", slug: "global", label: "Global", description: "Tools and services available worldwide." },
  ]
}

// Option 3: Use Geonames API (requires free API key)
async function fetchFromGeonames() {
  // Note: Get a free API key from http://www.geonames.org/login
  const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME

  if (!GEONAMES_USERNAME) {
    console.log("GEONAMES_USERNAME not set, skipping Geonames fetch")
    return []
  }

  console.log("Fetching countries from Geonames API...")

  try {
    const response = await fetch(`http://api.geonames.org/countryInfoJSON?username=${GEONAMES_USERNAME}`)
    const data = await response.json()

    const locations = data.geonames.map((country: any) => ({
      name: country.countryName,
      slug: country.countryName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      label: country.countryName,
      description: `Tools and services available in ${country.countryName}.`,
    }))

    return locations
  } catch (error) {
    console.error("Failed to fetch from Geonames:", error)
    return []
  }
}

async function main() {
  console.log("Fetching location data...")

  // Try different sources in order of preference
  let locations = await fetchFromRestCountries()

  if (locations.length === 0) {
    locations = await fetchFromGeonames()
  }

  if (locations.length === 0) {
    console.log("Using fallback location data...")
    locations = getFallbackLocations()
  }

  console.log(`Found ${locations.length} locations`)

  // Clear existing locations
  await db.location.deleteMany()
  console.log("Cleared existing locations")

  // Insert new locations
  await db.location.createMany({
    data: locations,
  })

  console.log(`Created ${locations.length} locations`)
  await db.$disconnect()
}

if (import.meta.main) {
  main().catch(console.error)
}

export { fetchFromRestCountries, fetchFromGeonames, getFallbackLocations }
