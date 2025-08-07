"use client";

import { FilterWrapper } from "@/components/shared/filter";
import { NuqsFormInput } from "@/components/shared/filter/nuqs-form-input";
import { NuqsFormSelect } from "@/components/shared/filter/nuqs-form-select";
import { CustomerTypeFilter } from "@/types/customer-type";

interface CustomerTypesFilterProps {
  filter: CustomerTypeFilter;
  onFilterChange: (filter: CustomerTypeFilter) => void;
}

export default function CustomerTypesFilter({ filter, onFilterChange }: CustomerTypesFilterProps) {
  const statusOptions = [
    { label: "All", value: "" },
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ];

  return (
    <FilterWrapper
      title="Filter Customer Types"
      description="Filter customer types by various criteria"
      onClear={() => {
        onFilterChange({
          page: 1,
          pageSize: 20,
          sortBy: 'name',
          sortDescending: false,
        });
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <NuqsFormInput
          name="search"
          placeholder="Search customer types..."
          label="Search"
          description="Search by customer type name, code, or description"
        />

        <NuqsFormInput
          name="code"
          placeholder="Customer Type Code"
          label="Code"
          description="Filter by specific customer type code"
        />

        <NuqsFormInput
          name="name"
          placeholder="Customer Type Name"
          label="Name"
          description="Filter by customer type name"
        />

        <NuqsFormSelect
          name="isActive"
          label="Status"
          description="Filter by active status"
          options={statusOptions}
        />
      </div>
    </FilterWrapper>
  );
}
