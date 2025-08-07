"use client";

import { useCustomerTypes } from "@/hooks/customers/use-customer-types";

interface CustomerTypeOption {
  label: string;
  value: string;
}

interface UseCustomerTypeOptionsProps {
  includeDefault?: boolean;
  defaultLabel?: string;
  defaultValue?: string;
  filterActive?: boolean;
  excludeId?: number;
}

export function useCustomerTypeOptions({
  includeDefault = true,
  defaultLabel = "Select customer type",
  defaultValue = "-1",
  filterActive = true,
  excludeId,
}: UseCustomerTypeOptionsProps = {}): CustomerTypeOption[] {
  const { data: customerTypes = { items: [] } } = useCustomerTypes({
    page: 1,
    pageSize: 1000,
  });

  let options: CustomerTypeOption[] = [];

  // Add default option if requested
  if (includeDefault) {
    options.push({
      label: defaultLabel,
      value: defaultValue,
    });
  }

  // Filter active items if requested
  let items = filterActive 
    ? customerTypes.items.filter(item => item.isActive)
    : customerTypes.items;

  // Exclude current item if excludeId is provided
  if (excludeId) {
    items = items.filter(item => item.id !== excludeId);
  }

  // Add customer type options
  const customerTypeOptions = items.map((customerType) => ({
    label: `${customerType.code} - ${customerType.name}`,
    value: customerType.code,
  }));

  return [...options, ...customerTypeOptions];
}

// Static options for common use cases
export const getCustomerTypeOptions = (): CustomerTypeOption[] => {
  return [
    { label: "Select customer type", value: "-1" },
  ];
};

// Component for direct use in forms
export function CustomerTypeOptions({ 
  includeDefault = true,
  defaultLabel = "Select customer type",
  defaultValue = "-1",
  filterActive = true,
  excludeId,
}: UseCustomerTypeOptionsProps) {
  const options = useCustomerTypeOptions({
    includeDefault,
    defaultLabel,
    defaultValue,
    filterActive,
    excludeId,
  });

  return options;
}
