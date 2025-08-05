"use client";

import { useActiveProductTypes } from "@/hooks/items/use-product-types";

interface ProductTypeOption {
  label: string;
  value: string;
}

interface UseProductTypeOptionsProps {
  includeDefault?: boolean;
  defaultLabel?: string;
  defaultValue?: string;
  filterActive?: boolean;
}

export function useProductTypeOptions({
  includeDefault = true,
  defaultLabel = "Select product type",
  defaultValue = "-1",
  filterActive = true,
}: UseProductTypeOptionsProps = {}): ProductTypeOption[] {
  const { data: productTypes = [] } = useActiveProductTypes();

  let options: ProductTypeOption[] = [];

  // Add default option if requested
  if (includeDefault) {
    options.push({
      label: defaultLabel,
      value: defaultValue,
    });
  }

  // Filter active items if requested
  const items = filterActive 
    ? productTypes.filter(item => item.isActive)
    : productTypes;

  // Add product type options
  const productTypeOptions = items.map((productType) => ({
    label: `${productType.code} - ${productType.name}`,
    value: productType.id.toString(),
  }));

  return [...options, ...productTypeOptions];
}

// Static options for common use cases
export const getProductTypeOptions = (): ProductTypeOption[] => {
  return [
    { label: "Select product type", value: "-1" },
  ];
};

// Component for direct use in forms
export function ProductTypeOptions({ 
  includeDefault = true,
  defaultLabel = "Select product type",
  defaultValue = "-1",
  filterActive = true,
}: UseProductTypeOptionsProps) {
  const options = useProductTypeOptions({
    includeDefault,
    defaultLabel,
    defaultValue,
    filterActive,
  });

  return options;
} 