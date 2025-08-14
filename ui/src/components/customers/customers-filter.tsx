"use client";

import { useQueryState } from "nuqs";
import { FilterWrapper, NuqsFormInput, NuqsFormSelect } from "@/components/shared/filter";
import { customerFilterParsers } from "@/lib/utils/customer-utils";
import { customerTypeOptions } from "@/lib/utils/customer-utils";

export default function CustomersFilter() {
  const [search, setSearch] = useQueryState("search", customerFilterParsers.search);
  const [customerCode, setCustomerCode] = useQueryState("customerCode", customerFilterParsers.customerCode);
  const [customerName, setCustomerName] = useQueryState("customerName", customerFilterParsers.customerName);
  const [customerTypeCode, setCustomerTypeCode] = useQueryState("customerTypeCode", customerFilterParsers.customerTypeCode);
  const [gstin, setGstin] = useQueryState("gstin", customerFilterParsers.gstin);
  const [isActive, setIsActive] = useQueryState("isActive", customerFilterParsers.isActive);
  const [isExportCustomer, setIsExportCustomer] = useQueryState("isExportCustomer", customerFilterParsers.isExportCustomer);

  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ];

  const clearFilters = () => {
    setSearch(null);
    setCustomerCode(null);
    setCustomerName(null);
    setCustomerTypeCode(null);
    setGstin(null);
    setIsActive(null);
    setIsExportCustomer(null);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (search) count++;
    if (customerCode) count++;
    if (customerName) count++;
    if (customerTypeCode) count++;
    if (gstin) count++;
    if (isActive !== null) count++;
    if (isExportCustomer !== null) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <FilterWrapper
      title="Filter Customers"
      activeFilterCount={activeFilterCount}
      onClearFilters={clearFilters}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <NuqsFormInput
          label="Search"
          value={search as string}
          onChange={setSearch}
          placeholder="Search customers..."
        />

        <NuqsFormInput
          label="Customer Code"
          value={customerCode as string}
          onChange={setCustomerCode}
          placeholder="Customer Code"
        />

        <NuqsFormInput
          label="Customer Name"
          value={customerName as string}
          onChange={setCustomerName}
          placeholder="Customer Name"
        />

        <NuqsFormSelect
          label="Customer Type"
          value={customerTypeCode as string}
          onChange={setCustomerTypeCode}
          options={customerTypeOptions}
        />

        <NuqsFormSelect
          label="Status"
          value={isActive === true ? "true" : isActive === false ? "false" : null}
          onChange={(value) => setIsActive(value === "true" ? true : value === "false" ? false : null)}
          options={statusOptions}
        />
      </div>
    </FilterWrapper>
  );
}
