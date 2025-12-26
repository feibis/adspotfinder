import type { PrismaClient } from "~/.generated/prisma/client"

export async function seedAttributes(db: PrismaClient) {
  console.log("Seeding attribute groups and attributes...")

  // Create attribute groups
  const sizeGroup = await db.attributeGroup.upsert({
    where: { slug: "size" },
    update: {},
    create: {
      name: "Size",
      slug: "size",
      description: "Storage unit size ranges",
      type: "multiple",
      order: 1,
    },
  })

  const typeGroup = await db.attributeGroup.upsert({
    where: { slug: "type" },
    update: {},
    create: {
      name: "Type",
      slug: "type",
      description: "Type of storage facility",
      type: "multiple",
      order: 2,
    },
  })

  const featuresGroup = await db.attributeGroup.upsert({
    where: { slug: "features" },
    update: {},
    create: {
      name: "Features",
      slug: "features",
      description: "Storage facility features and amenities",
      type: "multiple",
      order: 3,
    },
  })

  console.log("Created attribute groups")

  // Size attributes
  const sizes = [
    {
      name: "Extra Small (under 25 sq ft)",
      slug: "extra-small-under-25-sq-ft",
      value: "0-25",
      unit: "sq ft",
      order: 1,
      groupId: sizeGroup.id,
    },
    {
      name: "Small (25-50 sq ft)",
      slug: "small-25-50-sq-ft",
      value: "25-50",
      unit: "sq ft",
      order: 2,
      groupId: sizeGroup.id,
    },
    {
      name: "Medium (50-100 sq ft)",
      slug: "medium-50-100-sq-ft",
      value: "50-100",
      unit: "sq ft",
      order: 3,
      groupId: sizeGroup.id,
    },
    {
      name: "Large (100-200 sq ft)",
      slug: "large-100-200-sq-ft",
      value: "100-200",
      unit: "sq ft",
      order: 4,
      groupId: sizeGroup.id,
    },
    {
      name: "Extra Large (200-500 sq ft)",
      slug: "extra-large-200-500-sq-ft",
      value: "200-500",
      unit: "sq ft",
      order: 5,
      groupId: sizeGroup.id,
    },
    {
      name: "Commercial (500+ sq ft)",
      slug: "commercial-500-plus-sq-ft",
      value: "500+",
      unit: "sq ft",
      order: 6,
      groupId: sizeGroup.id,
    },
  ]

  // Type attributes
  const types = [
    {
      name: "Self Storage",
      slug: "self-storage",
      order: 1,
      groupId: typeGroup.id,
    },
    {
      name: "Container Storage",
      slug: "container-storage",
      order: 2,
      groupId: typeGroup.id,
    },
    {
      name: "Warehouse Storage",
      slug: "warehouse-storage",
      order: 3,
      groupId: typeGroup.id,
    },
    {
      name: "Vehicle Storage",
      slug: "vehicle-storage",
      order: 4,
      groupId: typeGroup.id,
    },
    {
      name: "Wine Storage",
      slug: "wine-storage",
      order: 5,
      groupId: typeGroup.id,
    },
    {
      name: "Document Storage",
      slug: "document-storage",
      order: 6,
      groupId: typeGroup.id,
    },
    {
      name: "Mobile Storage",
      slug: "mobile-storage",
      order: 7,
      groupId: typeGroup.id,
    },
  ]

  // Feature attributes
  const features = [
    {
      name: "Climate Controlled",
      slug: "climate-controlled",
      order: 1,
      groupId: featuresGroup.id,
    },
    {
      name: "24/7 Access",
      slug: "24-7-access",
      order: 2,
      groupId: featuresGroup.id,
    },
    {
      name: "Drive-Up Access",
      slug: "drive-up-access",
      order: 3,
      groupId: featuresGroup.id,
    },
    {
      name: "Security Cameras",
      slug: "security-cameras",
      order: 4,
      groupId: featuresGroup.id,
    },
    {
      name: "Gated Access",
      slug: "gated-access",
      order: 5,
      groupId: featuresGroup.id,
    },
    {
      name: "Elevator Access",
      slug: "elevator-access",
      order: 6,
      groupId: featuresGroup.id,
    },
    {
      name: "Ground Floor",
      slug: "ground-floor",
      order: 7,
      groupId: featuresGroup.id,
    },
    {
      name: "Indoor Units",
      slug: "indoor-units",
      order: 8,
      groupId: featuresGroup.id,
    },
    {
      name: "Outdoor Units",
      slug: "outdoor-units",
      order: 9,
      groupId: featuresGroup.id,
    },
    {
      name: "Electricity Available",
      slug: "electricity-available",
      order: 10,
      groupId: featuresGroup.id,
    },
    {
      name: "Loading Dock",
      slug: "loading-dock",
      order: 11,
      groupId: featuresGroup.id,
    },
    {
      name: "Packing Supplies",
      slug: "packing-supplies",
      order: 12,
      groupId: featuresGroup.id,
    },
  ]

  // Create all attributes
  for (const size of sizes) {
    await db.attribute.upsert({
      where: { slug: size.slug },
      update: {},
      create: size,
    })
  }
  console.log(`Created ${sizes.length} size attributes`)

  for (const type of types) {
    await db.attribute.upsert({
      where: { slug: type.slug },
      update: {},
      create: type,
    })
  }
  console.log(`Created ${types.length} type attributes`)

  for (const feature of features) {
    await db.attribute.upsert({
      where: { slug: feature.slug },
      update: {},
      create: feature,
    })
  }
  console.log(`Created ${features.length} feature attributes`)

  console.log("Attribute seeding completed.")
}

