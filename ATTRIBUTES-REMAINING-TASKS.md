# Attributes Implementation - Remaining Tasks

## ✅ Completed

### Backend (100%)
- ✅ Prisma schema updated
- ✅ Server actions (admin CRUD)
- ✅ Server queries (web & admin)
- ✅ Payloads and schemas
- ✅ Seed data
- ✅ Tool integration (queries, actions, schema)

### Web Frontend (100%)
- ✅ Web routes created:
  - `app/(web)/attributes/(attributes)/page.tsx` - Listing page
  - `app/(web)/attributes/[slug]/page.tsx` - Detail page
- ✅ Web components created:
  - `components/web/attributes/attribute-card.tsx`
  - `components/web/attributes/attribute-list.tsx`
  - `components/web/attributes/attribute-listing.tsx`
  - `components/web/attributes/attribute-query.tsx`

### Admin Frontend (Partial - 30%)
- ✅ Admin routes created:
  - `app/admin/attributes/page.tsx` - Listing page
  - `app/admin/attributes/new/page.tsx` - Create page
  - `app/admin/attributes/[slug]/page.tsx` - Edit page

## ❌ Still TODO

### 1. Admin Components (CRITICAL)
Need to create `app/admin/attributes/_components/`:

#### attribute-form.tsx
```typescript
"use client"
// Similar to tag-form.tsx but with:
// - Group selector (dropdown for Size/Type/Features)
// - Value field (optional, for numeric ranges)
// - Unit field (optional, for sq ft/sq m)
// - Order field (for sorting)
// - Tools multi-select
```

#### attributes-table.tsx
```typescript
"use client"
// Similar to tags-table.tsx
// Displays all attributes in a data table with:
// - Name, Group, Value, Unit, Order columns
// - Tools count
// - Actions (edit, duplicate, delete)
```

#### attributes-table-columns.tsx
```typescript
"use client"
// Column definitions for the attributes table
// Include: name, group.name, value, unit, order, _count.tools
```

#### attributes-table-toolbar-actions.tsx
```typescript
"use client"
// Toolbar with:
// - Create new attribute button
// - Bulk delete button
// - Group filter dropdown
```

#### attribute-actions.tsx
```typescript
"use client"
// Dropdown menu with:
// - Edit
// - Duplicate
// - Delete
```

#### attributes-delete-dialog.tsx
```typescript
"use client"
// Confirmation dialog for deleting attributes
// Uses deleteAttributes action
```

### 2. Tool Form Update (CRITICAL)
Update `app/admin/tools/_components/tool-form.tsx`:

```typescript
// Add after locations selector:
<FormField
  control={form.control}
  name="attributes"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Attributes</FormLabel>
      <FormControl>
        <AttributeGroupSelector
          value={field.value}
          onChange={field.onChange}
          attributesPromise={attributesPromise}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

Create `components/admin/attribute-group-selector.tsx`:
```typescript
// Groups attributes by AttributeGroup
// Shows each group as a section with checkboxes
// e.g.:
// Size
//   □ Small (25-50 sq ft)
//   □ Medium (50-100 sq ft)
// Type
//   □ Self Storage
//   □ Container Storage
```

### 3. Tool Detail Page Update
Update `app/(web)/[slug]/page.tsx` to display attributes:

```typescript
{/* Attributes - grouped by type */}
{!!tool.attributes.length && (
  <Stack direction="column" className="w-full">
    <H5 as="h4">Storage Details:</H5>
    {/* Group by attribute group */}
    {Object.entries(groupBy(tool.attributes, 'group.slug')).map(([groupSlug, attrs]) => (
      <div key={groupSlug}>
        <p className="text-sm font-medium">{attrs[0].group.name}:</p>
        <Stack>
          {attrs.map(attr => (
            <Tag key={attr.slug} asChild>
              <Link href={`/attributes/${attr.slug}`}>
                {attr.name}
              </Link>
            </Tag>
          ))}
        </Stack>
      </div>
    ))}
  </Stack>
)}
```

### 4. Navigation & Translations

#### Update `components/admin/sidebar.tsx`:
```typescript
// Add after locations:
{
  href: "/admin/attributes",
  title: "Attributes",
  icon: <TagsIcon />, // or <FilterIcon />
}
```

#### Update `components/web/header.tsx`:
```typescript
// Add to browse dropdown:
{
  href: "/attributes",
  title: t("navigation.attributes"),
}
```

#### Update `components/web/footer.tsx`:
```typescript
// Add to browse section:
<Link href="/attributes">{t("navigation.attributes")}</Link>
```

#### Add translations to `messages/en/navigation.json`:
```json
{
  "attributes": "Attributes"
}
```

#### Create `messages/en/attributes.json`:
```json
{
  "no_attributes": "No attributes found"
}
```

#### Add to `messages/en/pages.json`:
```json
{
  "attributes": {
    "title": "Storage Attributes",
    "description": "Browse storage facilities by size, type, and features on {siteName}"
  },
  "attribute": {
    "title": "{name}",
    "description": "Find storage facilities with {name} on {siteName}",
    "search": {
      "placeholder": "Search {name} storage..."
    },
    "group_label": "Category: {group}"
  }
}
```

### 5. Search Integration
Update `server/web/actions/search.ts` to include attributes:

```typescript
const [tools, categories, tags, locations, attributes] = await Promise.all([
  // ... existing queries ...
  db.attribute.findMany({
    where: { name: { contains: query, mode: "insensitive" } },
    include: { group: { select: { name: true } } },
    orderBy: { name: "asc" },
    take: 10,
  }),
])

return { tools, categories, tags, locations, attributes }
```

### 6. Attribute Filter Component
Create `components/web/attributes/attribute-filters.tsx`:
```typescript
// Advanced filter component for tool search
// Groups attributes by AttributeGroup
// Allows multi-select within each group
// Updates URL params for filtering
```

## Quick Start Commands

After creating the remaining files:

```bash
# From WSL terminal
bunx prisma migrate dev --name add_attributes
bunx prisma generate
bun prisma/seed.ts  # Run seed to populate attributes
bun run build
```

## File Creation Priority

1. **HIGH PRIORITY** (needed for basic functionality):
   - `app/admin/attributes/_components/attribute-form.tsx`
   - `app/admin/attributes/_components/attributes-table.tsx`
   - `app/admin/attributes/_components/attributes-table-columns.tsx`
   - Update `app/admin/tools/_components/tool-form.tsx`
   - Add translations

2. **MEDIUM PRIORITY** (needed for complete admin):
   - `app/admin/attributes/_components/attribute-actions.tsx`
   - `app/admin/attributes/_components/attributes-table-toolbar-actions.tsx`
   - `app/admin/attributes/_components/attributes-delete-dialog.tsx`
   - Update navigation (sidebar, header, footer)

3. **LOW PRIORITY** (nice to have):
   - Update tool detail page to show attributes
   - Advanced attribute filters
   - Search integration

## Notes

- All backend code is complete and ready
- Web routes are ready but need translations
- Admin routes are ready but need components
- The attribute system is fully functional once admin UI is complete
- You can test the backend immediately after running migrations

