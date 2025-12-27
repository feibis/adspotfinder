import type { PrismaClient } from "~/.generated/prisma/client"

export async function seedPricings(db: PrismaClient) {
  console.log("Seeding pricing combinations...")

  // Get all tools
  const tools = await db.tool.findMany({
    select: { id: true, name: true },
  })

  if (tools.length === 0) {
    console.log("No tools found, skipping pricing seed.")
    return
  }

  // Get attribute groups and attributes
  const sizeGroup = await db.attributeGroup.findUnique({
    where: { slug: "size" },
    include: { attributes: true },
  })

  const typeGroup = await db.attributeGroup.findUnique({
    where: { slug: "type" },
    include: { attributes: true },
  })

  const featuresGroup = await db.attributeGroup.findUnique({
    where: { slug: "features" },
    include: { attributes: true },
  })

  if (!sizeGroup || !typeGroup || !featuresGroup) {
    console.log("Attribute groups not found, skipping pricing seed.")
    return
  }

  // Example pricing combinations for the first tool
  const firstTool = tools[0]

  const pricingCombinations = [
    // Small units
    {
      name: "Small Standard Unit",
      description: "Perfect for personal items and small boxes",
      price: 50,
      currency: "USD",
      period: "month",
      unit: "per unit",
      toolId: firstTool.id,
      attributes: [
        sizeGroup.attributes.find(a => a.name.includes("Small"))?.id,
        typeGroup.attributes.find(a => a.name === "Self Storage")?.id,
      ].filter(Boolean) as string[],
    },
    {
      name: "Small Climate Controlled",
      description: "Small unit with temperature control",
      price: 75,
      currency: "USD",
      period: "month",
      unit: "per unit",
      toolId: firstTool.id,
      attributes: [
        sizeGroup.attributes.find(a => a.name.includes("Small"))?.id,
        typeGroup.attributes.find(a => a.name === "Self Storage")?.id,
        featuresGroup.attributes.find(a => a.name === "Climate Controlled")?.id,
      ].filter(Boolean) as string[],
    },

    // Medium units
    {
      name: "Medium Standard Unit",
      description: "Ideal for furniture and medium-sized items",
      price: 85,
      currency: "USD",
      period: "month",
      unit: "per unit",
      toolId: firstTool.id,
      attributes: [
        sizeGroup.attributes.find(a => a.name.includes("Medium"))?.id,
        typeGroup.attributes.find(a => a.name === "Self Storage")?.id,
      ].filter(Boolean) as string[],
    },
    {
      name: "Medium Climate + 24/7 Access",
      description: "Medium unit with climate control and round-the-clock access",
      price: 120,
      currency: "USD",
      period: "month",
      unit: "per unit",
      toolId: firstTool.id,
      attributes: [
        sizeGroup.attributes.find(a => a.name.includes("Medium"))?.id,
        typeGroup.attributes.find(a => a.name === "Self Storage")?.id,
        featuresGroup.attributes.find(a => a.name === "Climate Controlled")?.id,
        featuresGroup.attributes.find(a => a.name === "24/7 Access")?.id,
      ].filter(Boolean) as string[],
    },

    // Large units
    {
      name: "Large Warehouse Storage",
      description: "Large space for business inventory",
      price: 150,
      currency: "USD",
      period: "month",
      unit: "per unit",
      toolId: firstTool.id,
      attributes: [
        sizeGroup.attributes.find(a => a.name.includes("Large"))?.id,
        typeGroup.attributes.find(a => a.name === "Warehouse Storage")?.id,
      ].filter(Boolean) as string[],
    },
    {
      name: "Large Premium Package",
      description: "Large unit with all premium features",
      price: 200,
      currency: "USD",
      period: "month",
      unit: "per unit",
      toolId: firstTool.id,
      attributes: [
        sizeGroup.attributes.find(a => a.name.includes("Large"))?.id,
        typeGroup.attributes.find(a => a.name === "Self Storage")?.id,
        featuresGroup.attributes.find(a => a.name === "Climate Controlled")?.id,
        featuresGroup.attributes.find(a => a.name === "24/7 Access")?.id,
        featuresGroup.attributes.find(a => a.name === "Security Cameras")?.id,
        featuresGroup.attributes.find(a => a.name === "Drive-Up Access")?.id,
      ].filter(Boolean) as string[],
    },

    // Vehicle storage
    {
      name: "Vehicle Storage - Standard",
      description: "Outdoor parking for vehicles",
      price: 60,
      currency: "USD",
      period: "month",
      unit: "per vehicle",
      toolId: firstTool.id,
      attributes: [
        sizeGroup.attributes.find(a => a.name.includes("Medium"))?.id,
        typeGroup.attributes.find(a => a.name === "Vehicle Storage")?.id,
      ].filter(Boolean) as string[],
    },
    {
      name: "Vehicle Storage - Covered",
      description: "Covered parking with security",
      price: 95,
      currency: "USD",
      period: "month",
      unit: "per vehicle",
      toolId: firstTool.id,
      attributes: [
        sizeGroup.attributes.find(a => a.name.includes("Medium"))?.id,
        typeGroup.attributes.find(a => a.name === "Vehicle Storage")?.id,
        featuresGroup.attributes.find(a => a.name === "Security Cameras")?.id,
        featuresGroup.attributes.find(a => a.name === "Gated Access")?.id,
      ].filter(Boolean) as string[],
    },
  ]

  let createdCount = 0
  for (const pricing of pricingCombinations) {
    if (pricing.attributes.length > 0) {
      await db.pricing.upsert({
        where: { id: `pricing-${firstTool.id}-${createdCount}` },
        update: {
          ...pricing,
          attributes: { set: pricing.attributes.map(id => ({ id })) },
        },
        create: {
          id: `pricing-${firstTool.id}-${createdCount}`,
          ...pricing,
          attributes: { connect: pricing.attributes.map(id => ({ id })) },
        },
      })
      createdCount++
    }
  }

  console.log(`Seeded ${createdCount} pricing combinations for tool: ${firstTool.name}`)
  console.log("Pricing seeding completed.")
}

