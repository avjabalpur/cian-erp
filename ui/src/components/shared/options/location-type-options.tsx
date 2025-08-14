"use client";

import { useLocationTypes } from "@/hooks/use-location-types";

interface LocationTypeOption {
  label: string;
  value: string;
}

interface UseLocationTypeOptionsProps {
  includeDefault?: boolean;
  defaultLabel?: string;
  defaultValue?: string;
  filterActive?: boolean;
  excludeId?: number;
}

export function useLocationTypeOptions({
  includeDefault = true,
  defaultLabel = "Select location type",
  defaultValue = "-1",
  filterActive = true,
  excludeId,
}: UseLocationTypeOptionsProps = {}): LocationTypeOption[] {
  const { data: locationTypes = [] } = useLocationTypes();

  let options: LocationTypeOption[] = [];

  // Add default option if requested
  if (includeDefault) {
    options.push({
      label: defaultLabel,
      value: defaultValue,
    });
  }

  // Filter active items if requested
  let items = filterActive 
    ? locationTypes.filter(item => item.isActive)
    : locationTypes;

  // Exclude current item if excludeId is provided
  if (excludeId) {
    items = items.filter(item => item.id !== excludeId);
  }

  // Add location type options
  const locationTypeOptions = items.map((locationType) => ({
    label: `${locationType.code} - ${locationType.name}`,
    value: locationType.code,
  }));

  return [...options, ...locationTypeOptions];
}

// Static options for common use cases
export const getLocationTypeOptions = (): LocationTypeOption[] => {
  return [
    { label: "Select location type", value: "-1" },
  ];
};

// Component for direct use in forms
export function LocationTypeOptions({ 
  includeDefault = true,
  defaultLabel = "Select location type",
  defaultValue = "-1",
  filterActive = true,
  excludeId,
}: UseLocationTypeOptionsProps) {
  const options = useLocationTypeOptions({
    includeDefault,
    defaultLabel,
    defaultValue,
    filterActive,
    excludeId,
  });

  return options;
}
