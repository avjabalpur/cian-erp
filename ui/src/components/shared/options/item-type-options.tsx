"use client";

import { useItemTypes } from "@/hooks/items/use-item-types";

interface ItemTypeOption {
  label: string;
  value: string;
}

interface UseItemTypeOptionsProps {
  includeDefault?: boolean;
  defaultLabel?: string;
  defaultValue?: string;
  filterActive?: boolean;
  excludeId?: number;
}

export function useItemTypeOptions({
  includeDefault = true,
  defaultLabel = "Select item type",
  defaultValue = "-1",
  filterActive = true,
  excludeId,
}: UseItemTypeOptionsProps = {}): ItemTypeOption[] {
  const { data: itemTypes = { items: [] } } = useItemTypes();

  let options: ItemTypeOption[] = [];

  // Add default option if requested
  if (includeDefault) {
    options.push({
      label: defaultLabel,
      value: defaultValue,
    });
  }

  // Filter active items if requested
  let items = filterActive 
    ? itemTypes.items.filter(item => item.isActive)
    : itemTypes.items;

  // Exclude current item if excludeId is provided
  if (excludeId) {
    items = items.filter(item => item.id !== excludeId);
  }

  // Add item type options
  const itemTypeOptions = items.map((itemType) => ({
    label: `${itemType.code} - ${itemType.name}`,
    value: itemType.id.toString(),
  }));

  return [...options, ...itemTypeOptions];
}

// Static options for common use cases
export const getItemTypeOptions = (): ItemTypeOption[] => {
  return [
    { label: "Select item type", value: "-1" },
  ];
};

// Component for direct use in forms
export function ItemTypeOptions({ 
  includeDefault = true,
  defaultLabel = "Select item type",
  defaultValue = "-1",
  filterActive = true,
  excludeId,
}: UseItemTypeOptionsProps) {
  const options = useItemTypeOptions({
    includeDefault,
    defaultLabel,
    defaultValue,
    filterActive,
    excludeId,
  });

  return options;
} 