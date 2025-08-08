"use client";

interface HsnTypeOption {
  label: string;
  value: string;
}

interface UseHsnTypeOptionsProps {
  includeDefault?: boolean;
  defaultLabel?: string;
  defaultValue?: string;
}

export function useHsnTypeOptions({
  includeDefault = false,
  defaultLabel = "Select HSN type",
  defaultValue = "",
}: UseHsnTypeOptionsProps = {}): HsnTypeOption[] {
  let options: HsnTypeOption[] = [];

  // Add default option if requested
  if (includeDefault) {
    options.push({
      label: defaultLabel,
      value: defaultValue,
    });
  }

  // HSN type options
  const hsnTypeOptions: HsnTypeOption[] = [
    { value: "H", label: "H" },
    { value: "S", label: "S" },
  ];

  return [...options, ...hsnTypeOptions];
}

// Static options for common use cases
export const getHsnTypeOptions = (): HsnTypeOption[] => {
  return [
    { value: "H", label: "H" },
    { value: "S", label: "S" },
  ];
};

// Component for direct use in forms
export function HsnTypeOptions({ 
  includeDefault = false,
  defaultLabel = "Select HSN type",
  defaultValue = "",
}: UseHsnTypeOptionsProps) {
  const options = useHsnTypeOptions({
    includeDefault,
    defaultLabel,
    defaultValue,
  });

  return options;
} 