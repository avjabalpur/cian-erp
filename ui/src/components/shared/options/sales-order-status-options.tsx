"use client";

interface SalesOrderStatusOption {
  label: string;
  value: string;
}

interface UseSalesOrderStatusOptionsProps {
  includeDefault?: boolean;
  defaultLabel?: string;
  defaultValue?: string;
}

export function useSalesOrderStatusOptions({
  includeDefault = true,
  defaultLabel = "Select status",
  defaultValue = "-1",
}: UseSalesOrderStatusOptionsProps = {}): SalesOrderStatusOption[] {
  let options: SalesOrderStatusOption[] = [];

  // Add default option if requested
  if (includeDefault) {
    options.push({
      label: defaultLabel,
      value: defaultValue,
    });
  }

  // Common sales order statuses
  const salesOrderStatuses: SalesOrderStatusOption[] = [
    { label: "Draft", value: "DRAFT" },
    { label: "Pending", value: "PENDING" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Under Review", value: "UNDER_REVIEW" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Cancelled", value: "CANCELLED" },
    { label: "Completed", value: "COMPLETED" },
    { label: "On Hold", value: "ON_HOLD" },
    { label: "Repeat", value: "REPEAT" },
    { label: "New", value: "NEW" },
    { label: "Quotation", value: "QUOTATION" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "In Production", value: "IN_PRODUCTION" },
    { label: "Ready for Dispatch", value: "READY_FOR_DISPATCH" },
    { label: "Dispatched", value: "DISPATCHED" },
    { label: "Delivered", value: "DELIVERED" },
  ];

  return [...options, ...salesOrderStatuses];
}

// Static options for common use cases
export const getSalesOrderStatusOptions = (): SalesOrderStatusOption[] => {
  return [
    { label: "Select status", value: "-1" },
    { label: "Draft", value: "DRAFT" },
    { label: "Pending", value: "PENDING" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Repeat", value: "REPEAT" },
    { label: "New", value: "NEW" },
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
