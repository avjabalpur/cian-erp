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

// Quotation Status Options
export const quotationStatusOptions: StatusOption[] = [
  { label: "Draft", value: "draft", color: "gray", variant: "outline" },
  { label: "Sent", value: "sent", color: "blue", variant: "default" },
  { label: "Approved", value: "approved", color: "green", variant: "default" },
  { label: "Rejected", value: "rejected", color: "red", variant: "destructive" },
  { label: "Expired", value: "expired", color: "orange", variant: "outline" },
];

// Company Options (From original system)
export const companyOptions: SelectOption[] = [
  { label: "Any Company", value: "ANY" },
  { label: "CIAN HEALTHCARE", value: "CIAN HEALTHCARE" },
  { label: "DR. SMITH", value: "DR. SMITH" },
  { label: "Bayberry", value: "Bayberry" },
  { label: "SHEFIATRIC LIFE SCIENCES", value: "SHEFIATRIC LIFE SCIENCES" },
  { label: "CELESTA HEALTHCARE PVT. LTD.", value: "CELESTA HEALTHCARE PVT. LTD." },
  { label: "JM LIFESCIENCES PVT. LTD.", value: "JM LIFESCIENCES PVT. LTD." },
];

// nuqs Parsers for Quotations
export const quotationParsers = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  sortBy: parseAsString.withDefault("created_at"),
  sortOrder: parseAsString.withDefault("desc") as any,
  search: parseAsString.withDefault(""),
  companyName: parseAsString.withDefault(""),
  customerName: parseAsString.withDefault(""),
  status: parseAsString.withDefault(""),
  createdBy: parseAsInteger,
  fromDate: parseAsIsoDate,
  toDate: parseAsIsoDate
};

// Utility Functions
export const getQuotationStatusColor = (status: string): StatusOption => {
  return quotationStatusOptions.find(option => option.value === status) || 
         quotationStatusOptions[0]; 
};

export const getCompanyOption = (company: string): SelectOption => {
  return companyOptions.find(option => option.value === company) || 
         companyOptions[0]; // Default to first option
};

// Filter Default Values
export const defaultQuotationFilter = {
  page: 1,
  pageSize: 10,
  sortBy: "created_at",
  sortOrder: "desc" as "asc" | "desc",
  search: "",
  companyName: "",
  customerName: "",
  status: "",
  createdBy: undefined as number | undefined,
  fromDate: undefined as Date | undefined,
  toDate: undefined as Date | undefined
};
