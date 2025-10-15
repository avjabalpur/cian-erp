# 📦 Modules Directory

This directory contains all business logic organized by feature/module. Each module is self-contained with its own components, hooks, types, and validations.

## 🎯 Why Module-Based Structure?

### ❌ Old Structure Problems:
```
components/masters/department/     # Components scattered
hooks/use-departments.ts           # Hooks in separate folder
types/department.ts                # Types in another folder
validations/department.schema.ts   # Validations elsewhere
```
**Problems**: Hard to find related code, difficult to maintain, confusing for new developers

### ✅ New Structure Benefits:
```
modules/masters/departments/
  ├── components/         # All department components
  ├── hooks/             # All department hooks
  ├── types/             # All department types
  ├── validations/       # All department schemas
  └── index.ts           # Single export point
```
**Benefits**: Everything in one place, easy to find, easy to test, easy to delete

## 📁 Module Structure

Each module follows this structure:

```
modules/
├── [domain]/                    # e.g., masters, sales, inventory
│   └── [feature]/              # e.g., departments, divisions
│       ├── components/         # React components
│       │   ├── [feature]-management.tsx    # Main orchestrator
│       │   ├── [feature]-table.tsx         # Data table
│       │   ├── [feature]-drawer.tsx        # Side drawer
│       │   ├── [feature]-form.tsx          # Form
│       │   ├── [feature]-filter.tsx        # Filters
│       │   └── index.ts                    # Export all components
│       │
│       ├── hooks/              # Custom hooks
│       │   ├── use-[feature].ts           # Main hook
│       │   └── index.ts                    # Export all hooks
│       │
│       ├── types/              # TypeScript types
│       │   ├── [feature].types.ts
│       │   └── index.ts
│       │
│       ├── validations/        # Zod schemas
│       │   ├── [feature].schema.ts
│       │   └── index.ts
│       │
│       ├── utils/              # (Optional) Module-specific utilities
│       │   └── index.ts
│       │
│       └── index.ts            # Main module export (exports everything)
```

## 🚀 How to Use

### Import from Module (Recommended):
```typescript
// ✅ Import everything from one place
import { 
  DepartmentManagement,      // Main component
  useDepartments,            // Hook
  Department,                // Type
  departmentSchema           // Validation
} from '@/modules/masters/departments';
```

### Import Specific Items:
```typescript
// ✅ Import from sub-paths
import { DepartmentManagement } from '@/modules/masters/departments/components';
import { useDepartments } from '@/modules/masters/departments/hooks';
import { Department } from '@/modules/masters/departments/types';
```

### Page Implementation:
```typescript
// app/(admin)/masters/departments/page.tsx
import { DepartmentManagement } from "@/modules/masters/departments";

export default function DepartmentsPage() {
  return <DepartmentManagement />;
}
```

## 📝 Example: Creating a New Module

### Step 1: Create Module Structure
```bash
mkdir -p modules/masters/divisions/{components,hooks,types,validations}
```

### Step 2: Create Types
```typescript
// modules/masters/divisions/types/division.types.ts
export interface Division {
  id: number;
  code: string;
  name: string;
  // ... other fields
}

export type CreateDivisionData = Omit<Division, 'id'>;
export type UpdateDivisionData = Partial<Omit<Division, 'id'>> & { id: number };
```

### Step 3: Create Validation Schema
```typescript
// modules/masters/divisions/validations/division.schema.ts
import * as z from 'zod';

export const divisionSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  // ... other fields
});

export type DivisionFormData = z.infer<typeof divisionSchema>;
```

### Step 4: Create API Hook
```typescript
// modules/masters/divisions/hooks/use-divisions.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { Division } from '../types';

export const useDivisions = (params) => {
  return useQuery({
    queryKey: ['divisions', params],
    queryFn: () => api.get('/divisions', { params }),
  });
};

// ... other hooks
```

### Step 5: Create Components
```typescript
// modules/masters/divisions/components/division-management.tsx
export function DivisionManagement() {
  // Component logic
}
```

### Step 6: Create Index Files
```typescript
// modules/masters/divisions/index.ts
export * from './components';
export * from './hooks';
export * from './types';
export * from './validations';
```

### Step 7: Use in Page
```typescript
// app/(admin)/masters/divisions/page.tsx
import { DivisionManagement } from '@/modules/masters/divisions';

export default function DivisionsPage() {
  return <DivisionManagement />;
}
```

## 🎨 Best Practices

### 1. Single Responsibility
Each component/hook should do one thing well.

### 2. Naming Convention
- **Components**: `[Feature]Management`, `[Feature]Table`, `[Feature]Form`
- **Hooks**: `use[Feature]`, `use[Feature]ById`, `useCreate[Feature]`
- **Types**: `[Feature]`, `Create[Feature]Data`, `Update[Feature]Data`
- **Schemas**: `[feature]Schema`, `[Feature]FormData`

### 3. Export Everything Through Index
Always export through `index.ts` files for clean imports.

### 4. Keep Related Code Together
If it's only used in this module, it belongs in this module.

### 5. Shared Code Goes to `/components/shared` or `/lib`
Only truly shared utilities should live outside modules.

## 📂 Current Modules

### Masters
- ✅ `departments` - Complete implementation
- 🔄 `divisions` - To be migrated
- 🔄 `locations` - To be migrated
- 🔄 `organizations` - To be migrated
- 🔄 `dosages` - To be migrated
- 🔄 `items` - To be migrated
- 🔄 `products` - To be migrated
- 🔄 `customers` - To be migrated
- 🔄 `vendors` - To be migrated
- 🔄 `warehouses` - To be migrated

### Administrator
- 🔄 `users` - To be migrated
- 🔄 `roles` - To be migrated
- 🔄 `permissions` - To be migrated

## 🔄 Migration Guide

To migrate existing code to the new structure:

1. Create module folder structure
2. Move components to `components/`
3. Move hooks to `hooks/`
4. Move types to `types/`
5. Extract validation schemas to `validations/`
6. Create index files for each subfolder
7. Create main `index.ts` exporting everything
8. Update imports in pages and other files
9. Delete old files after verification

## 🎯 Goals

- ✅ Easy to find related code
- ✅ Easy to add new features
- ✅ Easy to remove features
- ✅ Easy to test
- ✅ Easy for new developers
- ✅ Scalable architecture

## 📚 Additional Resources

- [Feature-Sliced Design](https://feature-sliced.design/)
- [React Folder Structure Best Practices](https://reactjs.org/docs/faq-structure.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

