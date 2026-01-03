# Location Data Management

This project includes several ways to populate location data for agencys and tools.

## Available Methods

### 1. Seed File (Recommended for Development)
The main `prisma/seed.ts` includes a curated list of 40+ countries and regions:
- North America, Europe, Asia-Pacific, Middle East, Africa, South America
- Includes "Global" and "Remote" options

**Run:** `bun run db:seed`

### 2. Static Population Script (Production Ready)
Comprehensive list of 45+ locations, perfect for production seeding:

**Run:** `bun run db:populate-locations`

Includes countries like:
- United States, Canada, Mexico
- Germany, France, UK, Netherlands, Sweden, Norway
- Japan, South Korea, China, India, Australia, Singapore
- Brazil, Argentina, South Africa, UAE
- And many more...

### 3. API Fetch Script (Dynamic)
Fetches live data from online APIs:

**Sources:**
- **REST Countries API** (free, no API key)
- **Geonames API** (free API key required)
- **Fallback** to comprehensive static list

**Setup for Geonames:**
```bash
# Get free API key from http://www.geonames.org/login
export GEONAMES_USERNAME=your_username_here
bun run db:fetch-locations
```

**Run without API key:** `bun run db:fetch-locations` (uses REST Countries or fallback)

## Why Not Always Use Online APIs?

**Pros of online APIs:**
- Always up-to-date
- Comprehensive data
- No maintenance

**Cons:**
- Requires internet connection during seeding
- Potential rate limits
- API downtime affects development
- Privacy concerns (external API calls)
- Not suitable for air-gapped environments

**Our approach:** Use curated static data for reliability, with API options for when you need the latest data.

## Usage Examples

```bash
# Development seeding (includes locations)
bun run db:seed

# Production location population
bun run db:populate-locations

# Fetch latest from APIs
bun run db:fetch-locations
```

## Data Sources

- **REST Countries:** `https://restcountries.com/v3.1/all`
- **Geonames:** `http://api.geonames.org/countryInfoJSON`
- **Static lists:** Curated from reliable sources

## Adding Custom Locations

To add custom regions or cities:

```typescript
await db.location.create({
  data: {
    name: "Silicon Valley",
    slug: "silicon-valley",
    label: "Silicon Valley",
    description: "Tech hub in California, USA",
  }
})
```
