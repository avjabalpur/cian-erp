# Sales Order Approval System

This directory contains the comprehensive sales order approval system for the Cian ERP application. The system is built using modern React patterns with TypeScript, Next.js 14, and shadcn/ui components.

## Overview

The sales order approval system manages the complete lifecycle of sales orders from creation to production approval. It includes:

- **Multi-stage approval workflow** with role-based permissions
- **Real-time chat and comments** system
- **Document management** and file uploads
- **Integration with production systems** (Progen)
- **Advanced filtering and search** capabilities
- **Approval tools** for copying from previous orders

## Architecture

### Core Components

#### 1. **SalesOrdersManagement** (`sales-orders-management.tsx`)
- Main entry point for the sales orders module
- Handles table display, filtering, and basic CRUD operations
- Integrates with the approval workflow

#### 2. **Approval Components** (`approval/` directory)

##### **ApprovalWorkflow** (`approval-workflow.tsx`)
- **Purpose**: Manages the complete approval process
- **Features**:
  - Displays all approval stages in order
  - Shows progress and current status
  - Handles approval state transitions
  - Integrates with production system

##### **ApprovalCard** (`approval-cards.tsx`)
- **Purpose**: Individual approval stage component
- **Features**:
  - Role-based permission checking
  - Approval/rejection with comments
  - Historical comment display
  - Status indicators

##### **ApprovalTools** (`approval-tools.tsx`)
- **Purpose**: Utility tools for approval management
- **Features**:
  - Copy data from previous sales orders
  - Compare with production system (Progen)
  - Refresh dropdown options
  - Advanced data management

##### **SalesOrderApprovalContent** (`sales-order-approval-content.tsx`)
- **Purpose**: Main approval interface
- **Features**:
  - Form-based editing
  - Tabbed interface for different sections
  - Real-time chat integration
  - Document management

##### **SalesOrderApprovalTable** (`sales-order-approval-table.tsx`)
- **Purpose**: Data table for sales orders
- **Features**:
  - Advanced filtering and sorting
  - Status indicators
  - Action buttons
  - Pagination

#### 3. **Supporting Components**

- **SOInfoForm** - Sales order basic information
- **ProductInfoForm** - Product specifications
- **ReferenceDocuments** - Document management
- **ChatSidebar** - Real-time communication
- **MetricsDisplay** - Status overview
- **CreateApprovalFormModal** - New order creation

## Data Structure

### SalesOrder Interface
```typescript
interface SalesOrder {
  id: number;
  soNumber: string;
  soDate?: string;
  soStatus: string;
  customerId?: number;
  customerName?: string;
  itemId?: number;
  itemName?: string;
  dosageName?: string;
  currentStatus?: string;
  // Approval flags
  costingApproved?: boolean;
  qaApproved?: boolean;
  designerApproved?: boolean;
  finalQaApproved?: boolean;
  pmApproved?: boolean;
  finalAuthorized?: boolean;
  // ... other fields
}
```

### Approval Stages
1. **Costing Approval** - Product costing and pricing
2. **QA Approval** - Quality assurance
3. **Designer Approval** - Design and artwork
4. **Final QA Approval** - Final quality check
5. **PM Approval** - Project manager approval
6. **Final Authorization** - Production authorization

## Configuration

### Options Master (`lib/constants/sales-order-options.ts`)
Contains all dropdown options and configuration:
- Status options
- Dosage forms
- Manufacturer details
- Payment terms
- Company information

### Status Flow
```
IN-PROGRESS → SO-CONFIRMED → ADDED-TO-PROGEN
     ↓
REQUEST-CHANGES (if rejected)
     ↓
CANCEL (if cancelled)
```

## Usage

### Basic Implementation

```tsx
import { SalesOrdersManagement } from '@/components/sales-orders';

export default function SalesOrdersPage() {
  return <SalesOrdersManagement />;
}
```

### Approval Workflow

```tsx
import { ApprovalWorkflow } from '@/components/sales-orders/approval';

function SalesOrderDetail({ salesOrderId }: { salesOrderId: number }) {
  return (
    <ApprovalWorkflow
      salesOrderId={salesOrderId}
      userRoles={['qa_manager', 'project_manager']}
      onSalesOrderUpdate={(updatedOrder) => {
        // Handle updates
      }}
    />
  );
}
```

### Individual Approval Card

```tsx
import { ApprovalCard } from '@/components/sales-orders/approval';

function QaApproval({ salesOrderId }: { salesOrderId: number }) {
  return (
    <ApprovalCard
      salesOrderId={salesOrderId}
      title="QA Approval"
      approvalType="qa"
      approvalKey="qaApproved"
      requiredRoles={['qa_manager']}
      userRoles={['qa_manager']}
    />
  );
}
```

## Hooks

### Sales Order Hooks
- `useSalesOrders` - Fetch sales orders with filtering
- `useSalesOrderById` - Get single sales order
- `useCreateSalesOrder` - Create new sales order
- `useUpdateSalesOrder` - Update sales order
- `useDeleteSalesOrder` - Delete sales order

### Approval Hooks
- `useSalesOrderApprovals` - Get approval status
- `useCommentsBySalesOrder` - Get comments
- `useChatMessagesBySalesOrder` - Get chat messages
- `useDocumentsBySalesOrder` - Get documents

## Features

### 1. Role-Based Permissions
- Different users see different approval options
- Role-based access control for each approval stage
- Permission checking for actions

### 2. Real-Time Updates
- React Query for data fetching and caching
- Optimistic updates for better UX
- Real-time status changes

### 3. Document Management
- File upload and storage
- Document categorization
- Preview and download capabilities

### 4. Chat System
- Real-time messaging
- Comment threading
- User mentions and notifications

### 5. Advanced Tools
- Copy from previous sales orders
- Compare with production system
- Bulk operations
- Export capabilities

## Integration Points

### 1. Production System (Progen)
- Send approved orders to production
- Compare data with production system
- Sync status updates

### 2. Email System
- Send notifications on status changes
- Email approval requests
- Automated reminders

### 3. Document Storage
- File upload to cloud storage
- Document versioning
- Access control

## Styling

The system uses:
- **Tailwind CSS** for styling
- **shadcn/ui** components for consistency
- **Lucide React** for icons
- **Custom CSS** for specific components

## Performance

- **React Query** for efficient data fetching
- **Virtual scrolling** for large datasets
- **Lazy loading** for components
- **Optimistic updates** for better UX

## Testing

Components should be tested for:
- Approval workflow logic
- Permission checking
- Data validation
- Error handling
- User interactions

## Future Enhancements

1. **Mobile Responsiveness** - Better mobile experience
2. **Offline Support** - Work without internet
3. **Advanced Analytics** - Approval metrics and insights
4. **Workflow Customization** - Configurable approval flows
5. **Integration APIs** - More third-party integrations

## Migration from Original System

This new system improves upon the original by:
- **Modern Tech Stack** - Next.js 14, TypeScript, Tailwind
- **Better Architecture** - Custom hooks, proper separation
- **Enhanced UX** - Better UI/UX patterns
- **Improved Performance** - React Query, optimized rendering
- **Better Maintainability** - TypeScript, proper interfaces

## Support

For questions or issues:
1. Check the component documentation
2. Review the TypeScript interfaces
3. Examine the hooks implementation
4. Refer to the original system for business logic
