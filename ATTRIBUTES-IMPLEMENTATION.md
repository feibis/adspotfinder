# Attribute System Implementation

## Overview
Implemented a flexible attribute system for storage spaces that supports:
- **Sizes**: Small, Medium, Large, etc. with numeric ranges
- **Types**: Self Storage, Container Storage, Vehicle Storage, etc.
- **Features**: Climate Controlled, 24/7 Access, Drive-Up Access, etc.

## Database Schema Changes

### New Models Added

1. **AttributeGroup** - Groups attributes by type (Size, Type, Features)
   - `id`, `name`, `slug`, `description`
   - `type`: "single" | "multiple" | "range"
   - `order`: For display ordering

2. **Attribute** - Individual attributes within groups
   - `id`, `name`, `slug`
   - `value`: Numeric value (e.g., "50-100")
   - `unit`: Unit of measurement (e.g., "sq ft")
   - `order`: For display ordering
   - `groupId`: Reference to AttributeGroup

3. **Tool Model Updated**
   - Added `attributes Attribute[]` relation

## Files Created

### Server Files

#### Web (Public-facing)
- `server/web/attributes/payloads.ts` - Type definitions for API responses
- `server/web/attributes/queries.ts` - Database queries for attributes
- `server/web/attributes/schema.ts` - Search/filter schemas

#### Admin (Management)
- `server/admin/attributes/schema.ts` - Validation schemas
- `server/admin/attributes/queries.ts` - Admin database queries
- `server/admin/attributes/actions.ts` - CRUD server actions

### Seed Data
- `prisma/seed-attributes.ts` - Seeds 3 attribute groups with 25 attributes:
  - **Size Group**: 6 size ranges (Extra Small to Commercial)
  - **Type Group**: 7 storage types
  - **Features Group**: 12 facility features

## Files Updated

### Tool Integration
- `server/web/tools/payloads.ts` - Added attributes to tool payloads
- `server/admin/tools/queries.ts` - Include attributes in tool queries
- `server/admin/tools/actions.ts` - Handle attributes in upsert/duplicate
- `server/admin/tools/schema.ts` - Added attributes field to validation
- `prisma/seed.ts` - Calls attribute seeding

### Schema
- `prisma/schema.prisma` - Added AttributeGroup and Attribute models

## Next Steps (TODO)

### 1. Run Migration (REQUIRED)
From your WSL terminal where DATABASE_URL is configured:
```bash
bunx prisma migrate dev --name add_attributes
bunx prisma generate
```

### 2. Admin UI (Pending)
Need to create admin pages for managing attributes:
- `app/admin/attributes/page.tsx` - List all attributes
- `app/admin/attributes/new/page.tsx` - Create new attribute
- `app/admin/attributes/[slug]/page.tsx` - Edit attribute
- `app/admin/attributes/_components/` - Table, form, actions components
- `app/admin/attributes/groups/` - Similar pages for attribute groups

### 3. Tool Form Updates (Pending)
Update `app/admin/tools/_components/tool-form.tsx` to include:
- Attribute selection grouped by AttributeGroup
- Multi-select for each group
- Display current attributes

### 4. Web Display (Pending)
- Update `app/(web)/[slug]/page.tsx` to display attributes
- Create attribute filter components
- Add attribute-based search/filtering

### 5. Navigation (Pending)
- Add attributes to admin sidebar
- Add to navigation translations

## Usage Examples

### Querying Attributes by Group
```typescript
import { findAttributesByGroup } from "~/server/web/attributes/queries"

// Get all size attributes
const sizes = await findAttributesByGroup("size")

// Get all feature attributes
const features = await findAttributesByGroup("features")
```

### Filtering Tools by Attributes
```typescript
// In tool search query
const whereQuery = {
  status: ToolStatus.Published,
  attributes: {
    some: {
      slug: "medium-50-100-sq-ft",
      group: { slug: "size" }
    }
  }
}
```

### Creating New Attributes (Admin)
```typescript
import { upsertAttribute } from "~/server/admin/attributes/actions"

await upsertAttribute({
  name: "Huge (1000+ sq ft)",
  slug: "huge-1000-plus-sq-ft",
  value: "1000+",
  unit: "sq ft",
  order: 7,
  groupId: sizeGroupId,
})
```

## Benefits of This Approach

1. **Flexible**: Easy to add new attribute types without schema changes
2. **Structured**: Attributes are grouped logically (Size, Type, Features)
3. **Filterable**: Can filter by multiple attributes simultaneously
4. **Extensible**: Can add numeric ranges, units, and custom types
5. **Scalable**: Handles complex filtering scenarios
6. **Admin-Friendly**: Attributes can be managed via admin UI

## Seed Data Included

### Sizes (6 attributes)
- Extra Small (under 25 sq ft)
- Small (25-50 sq ft)
- Medium (50-100 sq ft)
- Large (100-200 sq ft)
- Extra Large (200-500 sq ft)
- Commercial (500+ sq ft)

### Types (7 attributes)
- Self Storage
- Container Storage
- Warehouse Storage
- Vehicle Storage
- Wine Storage
- Document Storage
- Mobile Storage

### Features (12 attributes)
- Climate Controlled
- 24/7 Access
- Drive-Up Access
- Security Cameras
- Gated Access
- Elevator Access
- Ground Floor
- Indoor Units
- Outdoor Units
- Electricity Available
- Loading Dock
- Packing Supplies

## Architecture Notes

- **AttributeGroup.type** field allows for future enhancements:
  - `"single"`: Only one attribute from group can be selected
  - `"multiple"`: Multiple attributes can be selected (current default)
  - `"range"`: For numeric range filters

- **Attribute.value** and **Attribute.unit** enable numeric filtering:
  - Can implement "find storage between X and Y sq ft"
  - Can convert between units (sq ft ↔ sq m)

- **order** fields on both models enable custom sorting in UI

