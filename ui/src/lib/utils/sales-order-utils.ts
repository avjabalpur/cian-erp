import { parseAsInteger, parseAsString, parseAsBoolean, parseAsIsoDate } from "nuqs";

export interface SelectOption {
  value: string;
  label: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export interface StatusOption extends SelectOption {
  color: string;
  bgColor: string;
}

// Sales Order Status Options
export const salesOrderStatusOptions: StatusOption[] = [
  {
    value: "new",
    label: "New",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    variant: "default"
  },
  {
    value: "draft",
    label: "Draft",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    variant: "secondary"
  },
  {
    value: "pending",
    label: "Pending",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    variant: "outline"
  },
  {
    value: "approved",
    label: "Approved",
    color: "text-green-600",
    bgColor: "bg-green-100",
    variant: "default"
  },
  {
    value: "rejected",
    label: "Rejected",
    color: "text-red-600",
    bgColor: "bg-red-100",
    variant: "destructive"
  },
  {
    value: "in_progress",
    label: "In Progress",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    variant: "outline"
  },
  {
    value: "completed",
    label: "Completed",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    variant: "default"
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "text-red-600",
    bgColor: "bg-red-100",
    variant: "destructive"
  },
  {
    value: "repeat",
    label: "Repeat",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    variant: "outline"
  }
];

// Payment Terms Options
export const paymentTermOptions: SelectOption[] = [
  { value: "advance", label: "Advance" },
  { value: "partial", label: "Partial" },
  { value: "credit", label: "Credit" },
  { value: "net_30", label: "Net 30" },
  { value: "net_60", label: "Net 60" },
  { value: "net_90", label: "Net 90" },
  { value: "cod", label: "Cash on Delivery" }
];

// Design Under Options
export const designUnderOptions: SelectOption[] = [
  { value: "design_team", label: "Design Team" },
  { value: "artwork_team", label: "Artwork Team" },
  { value: "external_designer", label: "External Designer" },
  { value: "client_design", label: "Client Design" }
];

// Tablet Type Options
export const tabletTypeOptions: SelectOption[] = [
  { value: "tablet", label: "Tablet" },
  { value: "capsule", label: "Capsule" },
  { value: "syrup", label: "Syrup" },
  { value: "injection", label: "Injection" },
  { value: "cream", label: "Cream" },
  { value: "ointment", label: "Ointment" }
];

// Tablet Size Options
export const tabletSizeOptions: SelectOption[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "extra_large", label: "Extra Large" }
];

// Change Part Options
export const changePartOptions: SelectOption[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "partial", label: "Partial" }
];

// Shipper Size Options
export const shipperSizeOptions: SelectOption[] = [
  { value: "standard", label: "Standard" },
  { value: "compact", label: "Compact" },
  { value: "large", label: "Large" },
  { value: "custom", label: "Custom" }
];

// Drug Approval Under Options
export const drugApprovalOptions: SelectOption[] = [
  { value: "fda", label: "FDA" },
  { value: "cdsco", label: "CDSCO" },
  { value: "who", label: "WHO" },
  { value: "ema", label: "EMA" },
  { value: "other", label: "Other" }
];

// Current Status Options
export const currentStatusOptions: StatusOption[] = [
  {
    value: "pending",
    label: "Pending",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    variant: "outline"
  },
  {
    value: "approved",
    label: "Approved",
    color: "text-green-600",
    bgColor: "bg-green-100",
    variant: "default"
  },
  {
    value: "rejected",
    label: "Rejected",
    color: "text-red-600",
    bgColor: "bg-red-100",
    variant: "destructive"
  },
  {
    value: "under_review",
    label: "Under Review",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    variant: "outline"
  },
  {
    value: "completed",
    label: "Completed",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    variant: "default"
  }
];

// Sort Options
export const sortOptions: SelectOption[] = [
  { value: "created_at", label: "Created Date" },
  { value: "updated_at", label: "Updated Date" },
  { value: "so_number", label: "SO Number" },
  { value: "so_date", label: "SO Date" },
  { value: "so_status", label: "Status" },
  { value: "customer_name", label: "Customer" },
  { value: "item_name", label: "Item" }
];

// Sort Order Options
export const sortOrderOptions: SelectOption[] = [
  { value: "desc", label: "Descending" },
  { value: "asc", label: "Ascending" }
];

// nuqs Parsers
export const salesOrderParsers = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  sortBy: parseAsString.withDefault("created_at"),
  sortOrder: parseAsString.withDefault("desc") as any,
  search: parseAsString.withDefault(""),
  soStatus: parseAsString.withDefault(""),
  paymentTerm: parseAsString.withDefault(""),
  designUnder: parseAsString.withDefault(""),
  currentStatus: parseAsString.withDefault(""),
  isSubmitted: parseAsBoolean,
  assignedDesigner: parseAsInteger,
  fromDate: parseAsIsoDate,
  toDate: parseAsIsoDate
};

// Utility Functions
export const getStatusColor = (status: string): StatusOption => {
  return salesOrderStatusOptions.find(option => option.value === status) || 
         salesOrderStatusOptions[0]; // Default to first option
};

export const getCurrentStatusColor = (status: string): StatusOption => {
  return currentStatusOptions.find(option => option.value === status) || 
         currentStatusOptions[0]; // Default to first option
};

export const formatDate = (date: string | Date): string => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: string | Date): string => {
  if (!date) return "-";
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount: string | number): string => {
  if (!amount) return "0.00";
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toFixed(2);
};

export const formatQuantity = (quantity: string | number): string => {
  if (!quantity) return "0";
  return quantity.toString();
};

// Filter Default Values
export const defaultSalesOrderFilter = {
  page: 1,
  pageSize: 10,
  sortBy: "created_at",
  sortOrder: "desc" as "asc" | "desc",
  search: "",
  soStatus: "",
  paymentTerm: "",
  designUnder: "",
  currentStatus: "",
  isSubmitted: undefined as boolean | undefined,
  assignedDesigner: undefined as number | undefined,
  fromDate: undefined as Date | undefined,
  toDate: undefined as Date | undefined
}; 