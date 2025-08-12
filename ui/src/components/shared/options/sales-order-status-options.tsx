"use client";

import { soStatusOptions, SelectOption } from "@/lib/utils/sales-order-utils";

interface UseSalesOrderStatusOptionsProps {
  includeDefault?: boolean;
  defaultLabel?: string;
  defaultValue?: string;
}

export function useSalesOrderStatusOptions({
  includeDefault = true,
  defaultLabel = "Select status",
  defaultValue = "-1",
}: UseSalesOrderStatusOptionsProps = {}): SelectOption[] {
  let options: SelectOption[] = [];

  // Add default option if requested
  if (includeDefault) {
    options.push({
      label: defaultLabel,
      value: defaultValue,
    });
  }

  // Use existing soStatusOptions from utils
  return [...options, ...soStatusOptions];
}

// Static options for common use cases
export const getSalesOrderStatusOptions = (): SelectOption[] => {
  return [
    { label: "Select status", value: "-1" },
    ...soStatusOptions
  ];
};

// Component for direct use in forms
export function SalesOrderStatusOptions({ 
  includeDefault = true,
  defaultLabel = "Select status",
  defaultValue = "",
}: UseSalesOrderStatusOptionsProps) {
  const options = useSalesOrderStatusOptions({
    includeDefault,
    defaultLabel,
    defaultValue,
  });

  return options;
}
