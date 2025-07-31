import { parseAsInteger, parseAsString, parseAsBoolean } from "nuqs";

// nuqs parsers for Config Setting filters
export const configSettingParsers = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(20),
  search: parseAsString.withDefault(""),
  isActive: parseAsBoolean.withDefault(true),
  sortBy: parseAsString.withDefault(""),
  sortOrder: parseAsString.withDefault(""),
};

// Filter options
export const statusOptions = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

// Default filter values
export const defaultConfigSettingFilter = {
  page: 1,
  pageSize: 20,
  search: "",
  isActive: true,
  sortBy: "",
  sortOrder: "",
}; 