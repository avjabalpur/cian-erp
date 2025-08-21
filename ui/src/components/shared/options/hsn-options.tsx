"use client";

import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';

interface HsnOption {
  label: string;
  value: string;
  uqc?: string;
}

interface UseHsnOptionsProps {
  includeDefault?: boolean;
  defaultLabel?: string;
  defaultValue?: string;
}

// API function to fetch HSN data
const getHsnOptions = async (): Promise<HsnOption[]> => {
  try {
    const { data } = await api.get('/hsn-master/hsn-types');
    return data.map((hsn: any) => ({
      label: `${hsn.code} - ${hsn.name}`,
      value: hsn.code,
      uqc: hsn.uqc,
    }));
  } catch (error) {
    console.error('Error fetching HSN options:', error);
    return [];
  }
};

export function useHsnOptions({
  includeDefault = true,
  defaultLabel = "Select HSN",
  defaultValue = "__SELECT__",
}: UseHsnOptionsProps = {}): HsnOption[] {
  const { data: hsnOptions = [], isLoading, error } = useQuery<HsnOption[]>({
    queryKey: ['hsn-options'],
    queryFn: getHsnOptions,
  });

  let options: HsnOption[] = [];

  // Add default option if requested
  if (includeDefault) {
    options.push({
      label: defaultLabel,
      value: defaultValue,
    });
  }

  return [...options, ...hsnOptions];
}

// Static options for common use cases
export const getHsnOptionsStatic = (): HsnOption[] => {
  return [
    { label: "Select HSN", value: "__SELECT__" },
    { label: "3004.90.00 - Other", value: "3004.90.00", uqc: "KGS" },
    { label: "3004.31.00 - Containing penicillins", value: "3004.31.00", uqc: "KGS" },
    { label: "3004.32.00 - Containing derivatives of penicillins", value: "3004.32.00", uqc: "KGS" },
  ];
};

// Component for direct use in forms
export function HsnOptions({ 
  includeDefault = true,
  defaultLabel = "Select HSN",
  defaultValue = "__SELECT__",
}: UseHsnOptionsProps) {
  const options = useHsnOptions({
    includeDefault,
    defaultLabel,
    defaultValue,
  });

  return options;
}
