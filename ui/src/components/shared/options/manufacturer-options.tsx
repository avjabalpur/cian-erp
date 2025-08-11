"use client";

import { useOrganizations } from "@/hooks/use-organizations";

interface ManufacturerOption {
  label: string;
  value: string;
  id?: number;
  country?: string;
}

interface UseManufacturerOptionsProps {
  includeDefault?: boolean;
  defaultLabel?: string;
  defaultValue?: string;
  filterActive?: boolean;
  excludeId?: number;
}

export function useManufacturerOptions({
  includeDefault = true,
  defaultLabel = "Select manufacturer",
  defaultValue = "-1",
  filterActive = true,
  excludeId,
}: UseManufacturerOptionsProps = {}): ManufacturerOption[] {
  const { data: organizationsResponse, isLoading } = useOrganizations({
    pageNumber: 1,
    pageSize: 100,
    isActive: filterActive,
  });

  const organizations = organizationsResponse?.items || [];

  if (isLoading) {
    return [];
  }

  let options: ManufacturerOption[] = [];

  // Add default option if requested
  if (includeDefault) {
    options.push({
      label: defaultLabel,
      value: defaultValue,
    });
  }

  // Filter active items if requested
  let items = filterActive 
    ? organizations.filter(item => item.isActive)
    : organizations;

  // Exclude current item if excludeId is provided
  if (excludeId) {
    items = items.filter(item => item.id !== excludeId);
  }

  // Add manufacturer options
  const manufacturerOptions = items.map((org) => ({
    label: org.name,
    value: org.id.toString(), // Use ID as value instead of name
    id: org.id,
    country: org.country,
  }));

  return [...options, ...manufacturerOptions];
}

// Static options for common use cases
export const getManufacturerOptions = (): ManufacturerOption[] => {
  return [
    { label: "Select manufacturer", value: "-1" },
    { label: "CIAN HEALTHCARE", value: "1" }, // Use actual organization ID
  ];
};

// Component for direct use in forms
export function ManufacturerOptions({ 
  includeDefault = true,
  defaultLabel = "Select manufacturer",
  defaultValue = "",
  filterActive = true,
  excludeId,
}: UseManufacturerOptionsProps) {
  const options = useManufacturerOptions({
    includeDefault,
    defaultLabel,
    defaultValue,
    filterActive,
    excludeId,
  });

  return options;
}
