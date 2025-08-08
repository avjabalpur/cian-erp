import { parseAsInteger, parseAsString, parseAsBoolean, parseAsIsoDate } from "nuqs";

export interface SelectOption {
  value: string;
  label: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  disabled?: boolean;
  shortName?: string;
}

export interface StatusOption extends SelectOption {
  color: string;
  bgColor?: string;
}

// Current Status Options
export const currentStatusOptions: StatusOption[] = [
  { 
    label: "IN-PROGRESS", 
    value: "IN-PROGRESS", 
    color: "orange", 
    shortName: "IN-PROG",
    variant: "outline"
  },
  { 
    label: "SO-CONFIRMED", 
    value: "SO-CONFIRMED", 
    color: "green", 
    shortName: "SO-CONF",
    variant: "default"
  },
  { 
    label: "ADDED-TO-PROGEN", 
    value: "ADDED-TO-PROGEN", 
    color: "blue", 
    disabled: true, 
    shortName: "PROGEN",
    variant: "secondary"
  },
  { 
    label: "REQUEST-CHANGES", 
    value: "REQUEST-CHANGES", 
    color: "purple", 
    disabled: true, 
    shortName: "REQ-CHA",
    variant: "outline"
  },
  { 
    label: "CANCEL", 
    value: "CANCEL", 
    color: "grey", 
    shortName: "CANCEL",
    variant: "destructive"
  },
];

// Sales Order Status Options
export const soStatusOptions: StatusOption[] = [
  { label: "NEW", value: "new", color: "blue", variant: "default" },
  { label: "REPEAT", value: "repeat", color: "orange", variant: "outline" },
  { label: "REVISED", value: "revised", color: "purple", variant: "secondary" },
];

// Product Shelf Life Options
export const pShelfLifeOptions: SelectOption[] = [
  { label: "NA", value: "NA" },
  { label: "18", value: "18" },
  { label: "24", value: "24" },
  { label: "36", value: "36" },
];



// Product Domino Options
export const pDominoOptions: SelectOption[] = [
  { label: "DOMINO", value: "DOMINO" },
  { label: "STEREO", value: "STEREO" },
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
  return soStatusOptions.find(option => option.value === status) || 
         soStatusOptions[0]; 
};

export const getCurrentStatusColor = (status: string): StatusOption => {
  return currentStatusOptions.find(option => option.value === status) || 
         currentStatusOptions[0]; // Default to first option
};

export const getCurrentStatusOption = (status: string): StatusOption => {
  return currentStatusOptions.find(option => option.value === status) || 
         currentStatusOptions[0]; // Default to first option
};

export const getSoStatusOption = (status: string): SelectOption => {
  return soStatusOptions.find(option => option.value === status) || 
         soStatusOptions[0]; // Default to first option
};



export const getPDominoOption = (domino: string): SelectOption => {
  return pDominoOptions.find(option => option.value === domino) || 
         pDominoOptions[0]; // Default to first option
};

export const getPShelfLifeOption = (shelfLife: string): SelectOption => {
  return pShelfLifeOptions.find(option => option.value === shelfLife) || 
         pShelfLifeOptions[0]; // Default to first option
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