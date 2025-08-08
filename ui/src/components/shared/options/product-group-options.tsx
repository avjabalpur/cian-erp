"use client";

import { useProductGroups } from "@/hooks/items/use-product-groups";

interface ProductGroupOption {
  label: string;
  value: string;
}

interface UseProductGroupOptionsProps {
  includeDefault?: boolean;
  defaultLabel?: string;
  defaultValue?: string;
  filterActive?: boolean;
  excludeId?: number;
}

export function useProductGroupOptions({
  includeDefault = true,
  defaultLabel = "Select product group",
  defaultValue = "-1",
  filterActive = true,
  excludeId,
}: UseProductGroupOptionsProps = {}): ProductGroupOption[] {
  const { data: productGroups = [] } = useProductGroups();

  let options: ProductGroupOption[] = [];

  // Add default option if requested
  if (includeDefault) {
    options.push({
      label: defaultLabel,
      value: defaultValue,
    });
  }

  // Filter active items if requested
  let items = filterActive 
    ? productGroups.filter(item => item.isActive)
    : productGroups;

  // Exclude current item if excludeId is provided
  if (excludeId) {
    items = items.filter(item => item.id !== excludeId);
  }

  // Add product group options
  const productGroupOptions = items.map((productGroup) => ({
    label: `${productGroup.code} - ${productGroup.productGroupName}`,
    value: productGroup.id.toString(),
  }));

  return [...options, ...productGroupOptions];
}

// Static options for common use cases
export const getProductGroupOptions = (): ProductGroupOption[] => {
  return [
    { label: "Select product group", value: "-1" },
  ];
};

// Component for direct use in forms
export function ProductGroupOptions({ 
  includeDefault = true,
  defaultLabel = "Select product group",
  defaultValue = "-1",
  filterActive = true,
  excludeId,
}: UseProductGroupOptionsProps) {
  const options = useProductGroupOptions({
    includeDefault,
    defaultLabel,
    defaultValue,
    filterActive,
    excludeId,
  });

  return options;
} 