# Quotations System

This directory contains the comprehensive quotations management system for the Cian ERP application. The system is built using modern React patterns with TypeScript, Next.js 14, and shadcn/ui components, following the same structure as the sales-orders system.

## Overview

The quotations system manages the complete lifecycle of quotations from creation to approval and conversion to sales orders. It includes:

- **Invoice-style quotation creation** with detailed product line items
- **Advanced filtering and search** capabilities
- **Integration with sales order approval** workflow
- **Real-time calculations** for taxes, charges, and totals
- **Professional invoice-style layout** based on the original system
- **Multi-company support** with different letterheads

## Architecture

### Core Components

#### 1. **QuotationsManagement** (`quotations-management.tsx`)
- Main entry point for the quotations module
- Handles table display, filtering, and basic CRUD operations
- Integrates with the sales order approval workflow

#### 2. **QuotationsTable** (`quotations-table.tsx`)
- Advanced data table for quotations
- Features:
  - Color-coded quotation numbers and companies
  - Amount formatting with currency
  - Advance amount with percentage calculation
  - Action buttons for view, edit, copy link, and create new
  - Server-side pagination and sorting

#### 3. **QuotationFormModal** (`quotation-form-modal.tsx`)
- **Purpose**: Invoice-style quotation creation and editing
- **Features**:
  - Professional invoice layout with company letterhead
  - Dynamic product line items with real-time calculations
  - Tax calculations per item and overall
  - Extra charges with separate tax rates
  - Advance payment percentage calculation
  - Auto-generated quotation numbers
  - Support for multiple companies (CIAN, Dr. Smith, etc.)

#### 4. **SalesOrderQuotationsTable** (`sales-order-quotations-table.tsx`)
- **Purpose**: Display quotations related to a specific sales order
- **Features**:
  - Embedded in sales order approval workflow
  - Search and filter capabilities
  - Direct integration with quotation management

### Data Structure

```typescript
interface SalesOrderQuotation {
  id: number;
  organizationId?: number;
  organizationName?: string;
  quotationNumber: string;
  quotationDate?: string;
  customerId?: number;
  customerName?: string;
  advancePercentage?: number;
  charges?: string; // JSON string for extra charges
  totalAmount?: number;
  advanceAmount?: number;
  prevCopyQuotationId?: number;
  isDeleted: boolean;
  createdAt: string;
  createdBy?: number;
  createdByName?: string;
}

interface SalesOrderQuotationItem {
  id: number;
  quotationId: number;
  salesOrderId?: number;
  itemId?: number;
  itemName?: string;
  composition?: string;
  dosageName?: string;
  productCast?: string;
  pPackShort?: string;
  soStatus?: string;
  pQuantity?: number;
  pFocQty?: number;
  pMrp?: number;
  pBillingRate?: number;
  comments?: string;
  taxPercent?: number;
  productExtraCharges?: number;
  productExtraChargesTaxPercent?: number;
}
```

## API Integration

The system integrates with the following API endpoints from the original system:

### Quotation Endpoints
- `POST /create-quotation` - Create new quotation
- `GET /get-sales-order-approval-quotation-by-id` - Get quotation by ID
- `GET /get-related-quotations-by-so-approval-id` - Get quotations for sales order
- `POST /get-all-quotations` - Get all quotations with filters

### Request/Response Format

#### Create Quotation Request
```json
{
  "company_name": "CIAN HEALTHCARE",
  "quotation_number": "QTD-2581-8074",
  "quotation_date": "2025-08-11",
  "customer_name": "Customer Name",
  "contact_person": "Contact Person",
  "mobile_no": "9999999999",
  "email_id": "customer@example.com",
  "payment_term": "Advance",
  "prepared_by": "Sales Team",
  "final_comment": "Validity of the Offer rate : 7 days...",
  "advance_percentage": 50,
  "charges": "{\"inventoryCharges\": 0, \"inventoryChargesTaxPercent\": 18}",
  "total_amount": 1000.00,
  "advance_amount": 500.00,
  "products": [
    {
      "sales_order_approval_id": 0,
      "product_name": "Product Name",
      "composition": "Product Composition",
      "dosage_name": "TABLET",
      "product_cast": "Cast",
      "p_pack_short": "Packing",
      "so_status": "Flag",
      "p_quantity": 1000,
      "p_foc_qty": 0,
      "p_mrp": 150.00,
      "p_billing_rate": 120.00,
      "comments": "Comments",
      "tax_percent": 18,
      "product_extra_charges": 0,
      "product_extra_charges_tax_percent": 0
    }
  ]
}
```

## Key Features

### 1. **Invoice-Style Layout**
- Professional company letterhead with dynamic company details
- Bank account information display
- Structured product table with comprehensive fields
- Real-time calculations for totals and taxes

### 2. **Dynamic Product Management**
- Add/remove product line items
- Real-time calculation of item totals
- Individual tax rates per product
- Extra charges with separate tax calculations
- FOC (Free of Cost) quantity support

### 3. **Multi-Company Support**
- Dynamic company selection (CIAN Healthcare, Dr. Smith, Bayberry, etc.)
- Company-specific letterheads and bank details
- Automatic quotation number generation per company

### 4. **Advanced Calculations**
- Product amount calculations
- Tax calculations per item and overall
- Extra charges with separate tax rates
- Advance payment percentage and amount
- Grand total with all charges included

### 5. **Integration with Sales Orders**
- Embedded quotations tab in sales order approval workflow
- Create quotations directly from sales orders
- Link quotations to specific sales order approvals

## Usage Examples

### Basic Implementation

```tsx
import { QuotationsManagement } from '@/components/sales-orders/quotation';

export default function QuotationsPage() {
  return <QuotationsManagement />;
}
```

### Embedded in Sales Order

```tsx
import { SalesOrderQuotationsTable } from '@/components/sales-orders/quotation';

function SalesOrderApproval({ salesOrderId }: { salesOrderId: number }) {
  return (
    <SalesOrderQuotationsTable
      quotations={quotations}
      salesOrderId={salesOrderId}
      onView={(quotation) => window.open(`/quotations/${quotation.id}`)}
      onEdit={(quotation) => setEditingQuotation(quotation)}
      onCreate={() => setCreatingQuotation(true)}
    />
  );
}
```

### Quotation Form Modal

```tsx
import { QuotationFormModal } from '@/components/sales-orders/quotation';

function QuotationManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [quotationId, setQuotationId] = useState<number | null>(null);

  return (
    <QuotationFormModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSuccess={(id) => console.log('Quotation saved:', id)}
      quotationId={quotationId}
    />
  );
}
```

## Hooks

### Quotation Hooks
- `useQuotations(filters)` - Fetch quotations with filtering
- `useQuotationById(id)` - Get single quotation
- `useQuotationsBySalesOrder(salesOrderId)` - Get quotations for sales order
- `useCreateQuotation()` - Create new quotation
- `useUpdateQuotation()` - Update quotation
- `useDeleteQuotation()` - Delete quotation

### Example Hook Usage

```tsx
// Get quotations with filters
const { data: quotationsData, isLoading } = useQuotations({
  from_time: "2025-01-01",
  to_time: "2025-12-31",
  company_name: "CIAN HEALTHCARE",
  customer_name: "Search Term"
});

// Create quotation
const createQuotationMutation = useCreateQuotation();

const handleCreate = async (data) => {
  try {
    const result = await createQuotationMutation.mutateAsync(data);
    console.log('Created quotation:', result.quotation_id);
  } catch (error) {
    console.error('Failed to create quotation:', error);
  }
};
```

## Styling

The system uses:
- **Tailwind CSS** for styling
- **shadcn/ui** components for consistency
- **Lucide React** for icons
- **Invoice-style layout** with professional appearance
- **Company-specific branding** with dynamic letterheads

## Migration from Original System

This new system improves upon the original by:

- **Modern Tech Stack** - Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Better Architecture** - Custom hooks, proper component separation, TypeScript interfaces
- **Enhanced UX** - Professional invoice layout, real-time calculations, better forms
- **Improved Performance** - React Query for caching, optimized rendering
- **Better Maintainability** - TypeScript validation, Zod schemas, proper error handling
- **Integration** - Seamless integration with sales order approval workflow

### Original vs New Features

| Original Feature | New Implementation | Enhancement |
|-----------------|-------------------|-------------|
| Basic quotation creation | `QuotationFormModal` | Invoice-style layout with real-time calculations |
| Simple table view | `QuotationsTable` | Advanced filtering, sorting, and actions |
| Manual calculations | Automatic calculations | Real-time totals, taxes, and advance amounts |
| Basic company support | Multi-company letterheads | Dynamic company selection with proper branding |
| Limited integration | Sales order integration | Embedded in approval workflow |

## Future Enhancements

1. **PDF Generation** - Export quotations as professional PDFs
2. **Email Integration** - Send quotations directly to customers
3. **Template System** - Customizable quotation templates
4. **Approval Workflow** - Multi-stage quotation approval process
5. **Version Control** - Track quotation revisions and history
6. **Customer Portal** - Allow customers to view and approve quotations

## Support

For questions or issues:
1. Check the component documentation
2. Review the TypeScript interfaces
3. Examine the hooks implementation
4. Refer to the original API documentation
