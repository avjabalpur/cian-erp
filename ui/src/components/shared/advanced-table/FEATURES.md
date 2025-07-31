# Advanced Table Features

## HTML Rendering Support

The Advanced Table now supports custom HTML rendering for cells using the `columnConfigs` prop. This allows you to render badges, custom components, and other HTML elements in table cells.

### Example: Status Badges with Display Names

```tsx
import { Badge } from '@/components/ui/badge'

const columnConfigs: Record<string, ColumnConfig> = {
  status: {
    name: 'status',
    data_type: 'string',
    description: 'Lead status',
    displayName: 'Status', // Custom display name for column header
    render: (value: string) => {
      const statusConfig = statusMap[value] || { label: value, variant: 'default' }
      return (
        <Badge variant={statusConfig.variant}>
          {statusConfig.label}
        </Badge>
      )
    }
  },
  firstName: {
    name: 'firstName',
    data_type: 'string',
    description: 'Lead first name',
    displayName: 'First Name' // Custom display name
  }
}
```

### Example: Boolean Values with Badges

```tsx
const columnConfigs: Record<string, ColumnConfig> = {
  isActive: {
    name: 'isActive',
    data_type: 'boolean',
    description: 'Active status',
    displayName: 'Active Status',
    render: (value: boolean) => (
      <Badge variant={value ? 'default' : 'secondary'}>
        {value ? 'Active' : 'Inactive'}
      </Badge>
    )
  }
}
```

## Multiple Row Selection

The table now supports multiple row selection with checkboxes and bulk operations.

### Enable Row Selection

```tsx
<AdvancedTable
  data={data}
  enableRowSelection={true}
  selectedRows={selectedRows}
  onSelectionChange={setSelectedRows}
  onBulkDelete={handleBulkDelete}
  rowIdField="id"
  // ... other props
/>
```

### Bulk Delete Functionality

When `onBulkDelete` is provided:
- Individual delete buttons are automatically hidden from action columns
- A "Delete Selected" button appears in the header when rows are selected
- The bulk delete function receives an array of selected row IDs

```tsx
const handleBulkDelete = (selectedIds: string[]) => {
  // Delete multiple items
  console.log('Deleting:', selectedIds)
}
```

## Complete Example

```tsx
import { AdvancedTable } from '@/components/shared/advanced-table'
import { Badge } from '@/components/ui/badge'

const MyTable = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const columnConfigs = {
    status: {
      name: 'status',
      data_type: 'string',
      description: 'Status',
      displayName: 'Lead Status',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    firstName: {
      name: 'firstName',
      data_type: 'string',
      description: 'First name',
      displayName: 'First Name'
    }
  }

  const handleBulkDelete = (ids: string[]) => {
    // Handle bulk delete
  }

  return (
    <AdvancedTable
      data={data}
      columns={['firstName', 'status', 'email']}
      columnConfigs={columnConfigs}
      enableRowSelection={true}
      selectedRows={selectedRows}
      onSelectionChange={setSelectedRows}
      onBulkDelete={handleBulkDelete}
      rowIdField="id"
    />
  )
}
```

## Props Reference

### New Props for HTML Rendering

- `columnConfigs?: Record<string, ColumnConfig>` - Custom column configurations with render functions

### New Props for Multiple Selection

- `enableRowSelection?: boolean` - Enable row selection checkboxes
- `selectedRows?: string[]` - Array of selected row IDs
- `onSelectionChange?: (selectedIds: string[]) => void` - Callback when selection changes
- `onBulkDelete?: (selectedIds: string[]) => void` - Callback for bulk delete operation
- `rowIdField?: string` - Field name to use as row ID (default: 'id')

### ColumnConfig Interface

```tsx
interface ColumnConfig {
  name: string
  data_type: string
  description: string | null
  displayName?: string // Custom display name for column header
  render?: (value: any, row: any) => React.ReactNode
}
```

## Migration Guide

### From Old Version

1. **Add HTML rendering**: Create `columnConfigs` object with custom render functions
2. **Add display names**: Use `displayName` property for custom column headers
3. **Enable bulk operations**: Add `enableRowSelection`, `onBulkDelete`, and related props
4. **Update action buttons**: Remove individual delete buttons when using bulk delete

### Before (Old Version)

```tsx
<AdvancedTable
  data={data}
  actionButtons={{
    onDelete: handleDelete // Individual delete buttons
  }}
/>
```

### After (New Version)

```tsx
<AdvancedTable
  data={data}
  columnConfigs={columnConfigs} // HTML rendering with display names
  enableRowSelection={true}
  onBulkDelete={handleBulkDelete} // Bulk delete instead of individual
  actionButtons={{
    onView: handleView,
    onEdit: handleEdit
    // onDelete removed when onBulkDelete is provided
  }}
/>
``` 