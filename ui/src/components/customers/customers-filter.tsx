"use client";

import { FilterWrapper } from "@/components/shared/filter";
import { NuqsFormInput } from "@/components/shared/filter/nuqs-form-input";
import { NuqsFormSelect } from "@/components/shared/filter/nuqs-form-select";
import { CustomerFilter } from "@/types/customer";
import { customerTypeOptions } from "@/lib/utils/customer-utils";

interface CustomersFilterProps {
  filter: CustomerFilter;
  onFilterChange: (filter: CustomerFilter) => void;
}

export default function CustomersFilter({ filter, onFilterChange }: CustomersFilterProps) {
  const statusOptions = [
    { label: "All", value: "" },
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ];

  const exportCustomerOptions = [
    { label: "All", value: "" },
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ];

  return (
    <FilterWrapper
      title="Filter Customers"
      description="Filter customers by various criteria"
      onClear={() => {
        onFilterChange({
          page: 1,
          pageSize: 20,
          sortBy: 'customerName',
          sortDescending: false,
        });
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <NuqsFormInput
          name="search"
          placeholder="Search customers..."
          label="Search"
          description="Search by customer name, code, or other details"
        />

        <NuqsFormInput
          name="customerCode"
          placeholder="Customer Code"
          label="Customer Code"
          description="Filter by specific customer code"
        />

        <NuqsFormInput
          name="customerName"
          placeholder="Customer Name"
          label="Customer Name"
          description="Filter by customer name"
        />

        <NuqsFormSelect
          name="customerTypeCode"
          label="Customer Type"
          description="Filter by customer type"
          options={customerTypeOptions}
        />

        <NuqsFormInput
          name="gstin"
          placeholder="GSTIN"
          label="GSTIN"
          description="Filter by GSTIN number"
        />

        <NuqsFormSelect
          name="isActive"
          label="Status"
          description="Filter by active status"
          options={statusOptions}
        />

        <NuqsFormSelect
          name="isExportCustomer"
          label="Export Customer"
          description="Filter by export customer status"
          options={exportCustomerOptions}
        />
      </div>
    </FilterWrapper>
  );
}
