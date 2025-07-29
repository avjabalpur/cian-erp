import { parseAsInteger, parseAsString, parseAsBoolean } from "nuqs";
import { z } from "zod";

// nuqs parsers for HSN Master filters
export const hsnMasterParsers = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(20),
  search: parseAsString.withDefault(""),
  isActive: parseAsBoolean.withDefault(true),
};

// Filter options
export const statusOptions = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export const sortOptions = [
  { value: "code", label: "Code" },
  { value: "description", label: "Description" },
  { value: "hsnType", label: "HSN Type" },
  { value: "taxRate", label: "Tax Rate" },
  { value: "createdAt", label: "Created Date" },
];

export const sortOrderOptions = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

export const pageSizeOptions = [
  { value: "10", label: "10 per page" },
  { value: "20", label: "20 per page" },
  { value: "50", label: "50 per page" },
  { value: "100", label: "100 per page" },
];

// Default filter values
export const defaultHsnMasterFilter = {
  page: 1,
  pageSize: 20,
  search: null,
  isActive: null,
  sortBy: null,
  sortOrder: null,
}; 