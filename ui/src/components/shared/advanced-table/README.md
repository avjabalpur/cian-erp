# Advanced Table Component

A powerful, feature-rich table component built on TanStack Table with advanced filtering, grouping, and export capabilities.

## Features

- **Advanced Filtering**: String, number, boolean, and date filters with operators
- **Grouping**: Drag-and-drop column grouping with multi-level support
- **Global Search**: Search across all columns simultaneously
- **Column Management**: Show/hide columns with visibility controls
- **Export**: Export filtered data to CSV
- **Row Interactions**: Clickable rows and action buttons
- **Pagination**: Client-side pagination with customizable page sizes
- **Responsive**: Mobile-friendly design

## Usage

```tsx
import { AdvancedTable } from '@/components/shared/advanced-table'
import { Column } from '@/components/shared/advanced-table/types'

const MyComponent = () => {
  const data = [
    { id: 1, name: 'John', age: 30, active: true },
    { id: 2, name: 'Jane', age: 25, active: false },
  ]

  const columnMeta: Column[] = [
    { name: 'name', data_type: 'string', description: 'Person name' },
    { name: 'age', data_type: 'number', description: 'Person age' },
    { name: 'active', data_type: 'boolean', description: 'Active status' },
  ]

  const handleRowClick = (row: any) => {
    console.log('Row clicked:', row)
  }

  const actionButtons = {
    onEdit: (row: any) => console.log('Edit:', row),
    onDelete: (row: any) => console.log('Delete:', row),
  }

  return (
    <AdvancedTable
      data={data}
      columns={['name', 'age', 'active']}
      columnMeta={columnMeta}
      onRowClick={handleRowClick}
      actionButtons={actionButtons}
      groupingEnabled={true}
      globalFilterEnabled={true}
      dragDropGroupingEnabled={true}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `any[]` | Required | Array of data objects |
| `columns` | `string[]` | Auto-detected | Column keys to display |
| `columnMeta` | `Column[]` | `[]` | Metadata for proper filtering |
| `isLoading` | `boolean` | `false` | Show loading state |
| `groupingEnabled` | `boolean` | `true` | Enable grouping features |
| `globalFilterEnabled` | `boolean` | `true` | Enable global search |
| `dragDropGroupingEnabled` | `boolean` | `true` | Enable drag-drop grouping |
| `onRowClick` | `(row: any) => void` | - | Row click handler |
| `actionButtons` | `ActionButtons` | - | Action button configuration |
| `className` | `string` | `''` | Additional CSS classes |

## Column Metadata

Define column metadata for proper filtering and display:

```tsx
const columnMeta: Column[] = [
  { name: 'firstName', data_type: 'string', description: 'First name' },
  { name: 'age', data_type: 'number', description: 'Age in years' },
  { name: 'isActive', data_type: 'boolean', description: 'Active status' },
  { name: 'createdAt', data_type: 'date', description: 'Creation date' },
]
```

## Action Buttons

Configure action buttons for each row:

```tsx
const actionButtons = {
  onView: (row: any) => navigate(`/view/${row.id}`),
  onEdit: (row: any) => navigate(`/edit/${row.id}`),
  onDelete: (row: any) => handleDelete(row.id),
}
```

## Files Structure

```
ui/components/shared/advanced-table/
├── index.tsx                 # Main exports
├── advanced-table-wrapper.tsx # Main component
├── types.ts                  # TypeScript types
├── utils.ts                  # Utility exports
├── column-utils.ts           # Column type utilities
├── export-utils.ts           # CSV export utilities
└── drag-drop-grouping.tsx    # Drag-drop grouping component
```

## Migration from Old DataTable

The AdvancedTable is a drop-in replacement for the old DataTable with enhanced features. Key differences:

1. **Client-side pagination** instead of server-side
2. **Advanced filtering** with type-aware filters
3. **Grouping capabilities** with drag-and-drop
4. **Better performance** with virtual scrolling
5. **Export functionality** built-in

## Examples

See `ui/components/sales/leads/lead-table-advanced.tsx` for a complete implementation example with Lead data.
