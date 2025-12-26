# Create Remaining Admin Components

## Instructions
Copy the corresponding tag component files and replace "tag/Tag" with "attribute/Attribute":

### 1. attribute-actions.tsx
```bash
# Copy from:
app/admin/tags/_components/tag-actions.tsx
# To:
app/admin/attributes/_components/attribute-actions.tsx

# Changes:
- Import from ~/server/admin/attributes/actions
- Use duplicateAttribute, deleteAttributes
- Change references from tag to attribute
```

### 2. attributes-table.tsx
```bash
# Copy from:
app/admin/tags/_components/tags-table.tsx
# To:
app/admin/attributes/_components/attributes-table.tsx

# Changes:
- Import attributesTableColumns
- Use findAttributes query type
- Change "tags" to "attributes" throughout
```

### 3. attributes-table-columns.tsx
```bash
# Copy from:
app/admin/tags/_components/tags-table-columns.tsx
# To:
app/admin/attributes/_components/attributes-table-columns.tsx

# Changes:
- Type: Attribute instead of Tag
- Add columns: group.name, value, unit, order
- Remove or adjust as needed
```

### 4. attributes-table-toolbar-actions.tsx
```bash
# Copy from:
app/admin/tags/_components/tags-table-toolbar-actions.tsx
# To:
app/admin/attributes/_components/attributes-table-toolbar-actions.tsx

# Changes:
- Link to /admin/attributes/new
- Use AttributesDeleteDialog
```

### 5. attributes-delete-dialog.tsx
```bash
# Copy from:
app/admin/tags/_components/tags-delete-dialog.tsx
# To:
app/admin/attributes/_components/attributes-delete-dialog.tsx

# Changes:
- Use deleteAttributes action
- Change "tags" to "attributes"
```

## Quick Copy Commands (if files are similar enough)

```bash
# From project root
cd app/admin

# Copy tag components to attributes
cp -r tags/_components attributes/_components

# Then manually update imports and references in each file
```

## After Creating Files

1. Update all imports to use attribute-specific modules
2. Change all "tag/Tag" references to "attribute/Attribute"  
3. Add group-specific columns/fields where needed
4. Test the admin interface

## Files Created Status

- ✅ attribute-form.tsx (DONE)
- ❌ attribute-actions.tsx (TODO - copy from tag-actions.tsx)
- ❌ attributes-table.tsx (TODO - copy from tags-table.tsx)
- ❌ attributes-table-columns.tsx (TODO - copy from tags-table-columns.tsx)
- ❌ attributes-table-toolbar-actions.tsx (TODO - copy from tags-table-toolbar-actions.tsx)
- ❌ attributes-delete-dialog.tsx (TODO - copy from tags-delete-dialog.tsx)

