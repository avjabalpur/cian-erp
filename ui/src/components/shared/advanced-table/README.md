# Advanced Table Component

A powerful, feature-rich table component built on TanStack Table with advanced filtering, grouping, and export capabilities.

## Features

- **Advanced Filtering**: String, number, boolean, and date filters with operators
- **Grouping**: Drag-and-drop column grouping with multi-level support
- **Global Search**: Search across all columns simultaneously
- **Column Management**: Show/hide columns with visibility controls using `isDefault` flag
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
    { 
      name: 'name', 
      data_type: 'string', 
      displayName: 'Person Name',
      description: 'Person name',
      isDefault: true 
    },
    { 
      name: 'age', 
      data_type: 'number', 
      displayName: 'Age',
      description: 'Person age',
      isDefault: true 
    },
    { 
      name: 'active', 
      data_type: 'boolean', 
      displayName: 'Active Status',
      description: 'Active status',
      isDefault: false 
    },
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
| `columnMeta` | `Column[]` | Required | Column metadata with `isDefault` flag |
| `isLoading` | `boolean` | `false` | Loading state |
| `groupingEnabled` | `boolean` | `true` | Enable column grouping |
| `globalFilterEnabled` | `boolean` | `true` | Enable global search |
| `dragDropGroupingEnabled` | `boolean` | `true` | Enable drag-and-drop grouping |
| `onRowClick` | `(row: any) => void` | - | Row click handler |
| `actionButtons` | `object` | - | Action button configuration |

## Column Configuration

The `columnMeta` prop defines all available columns with their properties:

```tsx
interface Column {
  name: string                    // Column key in data
  data_type: string              // Data type: 'string', 'number', 'boolean', 'date'
  displayName?: string           // Display name for header and dropdown
  description?: string           // Column description
  isDefault?: boolean            // Whether to show by default (default: false)
  render?: CellRenderer          // Custom cell renderer function
}
```

### Column Visibility

- **`isDefault: true`**: Column is shown by default when table loads
- **`isDefault: false`**: Column is hidden by default but available in column dropdown
- **`isDefault: undefined`**: Treated as `false` (hidden by default)

Users can toggle column visibility using the "Columns" dropdown in the table header.
