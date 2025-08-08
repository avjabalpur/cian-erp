"use client";

import { useDosages } from "@/hooks/use-dosages";

interface DosageOption {
  label: string;
  value: string;
}

interface UseDosageOptionsProps {
  includeDefault?: boolean;
  defaultLabel?: string;
  defaultValue?: string;
  filterActive?: boolean;
  excludeId?: number;
}

export function useDosageOptions({
  includeDefault = true,
  defaultLabel = "Select dosage",
  defaultValue = "-1",
  filterActive = true,
  excludeId,
}: UseDosageOptionsProps = {}): DosageOption[] {
  const { data: dosages, isLoading } = useDosages();
  const dosagesList = dosages?.items || [];

  if (isLoading) {
    return [];
  }
  let options: DosageOption[] = [];

  // Add default option if requested
  if (includeDefault) {
    options.push({
      label: defaultLabel,
      value: defaultValue,
    });
  }

  // Filter active items if requested
  let items = filterActive 
    ? dosagesList.filter(item => item.isActive)
    : dosagesList;

  // Exclude current item if excludeId is provided
  if (excludeId) {
    items = items.filter(item => item.id !== excludeId);
  }

  // Add dosage options
  const dosageOptions = items.map((dosage) => ({
    label: dosage.name,
    value: dosage.name,
  }));

  return [...options, ...dosageOptions];
}

// Static options for common use cases
export const getDosageOptions = (): DosageOption[] => {
  return [
    { label: "Select dosage", value: "-1" },
  ];
};

// Component for direct use in forms
export function DosageOptions({ 
  includeDefault = true,
  defaultLabel = "Select dosage",
  defaultValue = "-1",
  filterActive = true,
  excludeId,
}: UseDosageOptionsProps) {
  const options = useDosageOptions({
    includeDefault,
    defaultLabel,
    defaultValue,
    filterActive,
    excludeId,
  });

  return options;
} 