import { parseAsInteger, parseAsString, parseAsBoolean } from "nuqs";

export interface SelectOption {
  value: string;
  label: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  disabled?: boolean;
  shortName?: string;
}

// Status Options
export const statusOptions: SelectOption[] = [
  { label: "All Statuses", value: "" },
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

// Sort Options
export const sortOptions: SelectOption[] = [
  { value: "created_at", label: "Created Date" },
  { value: "updated_at", label: "Updated Date" },
  { value: "code", label: "Code" },
  { value: "name", label: "Name" },
  { value: "description", label: "Description" },
];

// Sort Order Options
export const sortOrderOptions: SelectOption[] = [
  { value: "desc", label: "Descending" },
  { value: "asc", label: "Ascending" }
];

// Page Size Options
export const pageSizeOptions: SelectOption[] = [
  { label: "10 per page", value: "10" },
  { label: "25 per page", value: "25" },
  { label: "50 per page", value: "50" },
  { label: "100 per page", value: "100" },
];

// nuqs Parsers
export const itemTypeParsers = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  sortBy: parseAsString.withDefault("created_at"),
  sortOrder: parseAsString.withDefault("desc") as any,
  searchTerm: parseAsString.withDefault(""),
  isActive: parseAsBoolean,
};

// Filter Default Values
export const defaultItemTypeFilter = {
  page: 1,
  pageSize: 10,
  sortBy: "created_at",
  sortOrder: "desc" as "asc" | "desc",
  searchTerm: "",
  isActive: undefined as boolean | undefined,
}; 